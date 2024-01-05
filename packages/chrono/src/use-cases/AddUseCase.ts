import IndexEntry from '../entities/IndexEntry'
import IDrive from '../gateways/IDrive'

import IBlobRepository from '../repositories/IBlobRepository'
import IHeadEntryRepository from '../repositories/IHeadEntryRepository'
import IIndexEntryRepository from '../repositories/IIndexEntryRepository'
import IObjectRepository from '../repositories/IObjectRepository'

import HashEntryService from '../services/HashEntryService'

interface Params {
    path: string | string[]
}

export default class AddUseCase {
    constructor(
        private readonly drive: IDrive,
        private readonly objectRepository: IObjectRepository,
        private readonly blobRepository: IBlobRepository,
        private readonly indexEntryRepository: IIndexEntryRepository,
        private readonly headEntryRepository: IHeadEntryRepository
    ) {}

    public async addFileEntry(path: string) {
        const hashService = new HashEntryService(
            this.drive,
            this.objectRepository,
            this.blobRepository
        )

        const indexEntries = await this.indexEntryRepository.findAll()
        const headEntries = await this.headEntryRepository.findAll()

        const indexEntry = indexEntries.find((entry) => entry.path === path)
        const headEntry = headEntries.find((entry) => entry.path === path)

        const { objectHash } = await hashService.hashEntry(path)

        // untracked
        if (!indexEntry) {
            const newEntry = new IndexEntry(path, objectHash, IndexEntry.STATUS.Added)

            indexEntries.push(newEntry)

            await this.indexEntryRepository.saveAll(indexEntries)

            return newEntry
        }

        // modified
        if (headEntry && headEntry.hash !== objectHash) {
            indexEntry.status = IndexEntry.STATUS.Modified
            indexEntry.hash = objectHash

            await this.indexEntryRepository.saveAll(indexEntries)

            return indexEntry
        }

        // unmodified
        return indexEntry
    }

    public async addDirectoryEntry(path: string) {
        const result = [] as IndexEntry[]

        const files = await this.drive.readdir(path, {
            recursive: true,
            onlyFiles: true,
        })

        for await (const file of files) {
            const entry = await this.addFileEntry(`${path}/${file}`)

            result.push(entry)
        }

        return result
    }

    public async execute({ path }: Params) {
        const result = [] as IndexEntry[]
        const paths = Array.isArray(path) ? path : [path]

        for await (const p of paths) {
            if (await this.drive.isFile(p)) {
                const entry = await this.addFileEntry(p)

                result.push(entry)

                continue
            }

            const entries = await this.addDirectoryEntry(p)

            result.push(...entries)
        }

        return result
    }
}
