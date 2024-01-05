import IndexEntry from '../entities/IndexEntry'
import IDrive from '../gateways/IDrive'

import IBlobRepository from '../repositories/IBlobRepository'
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
        private readonly entryRepository: IIndexEntryRepository
    ) {}

    public async addFileEntry(path: string) {
        const hashService = new HashEntryService(
            this.drive,
            this.objectRepository,
            this.blobRepository
        )

        // list all workspace entries
        const entries = await this.entryRepository.findAll()

        const entry = entries.find((entry) => entry.path === path)

        const { objectHash } = await hashService.hashEntry(path)

        if (entry && entry.hash === objectHash) {
            entry.status = IndexEntry.STATUS.Unmodified

            await this.entryRepository.saveAll(entries)

            return entry
        }

        if (entry) {
            entry.status = IndexEntry.STATUS.Added

            await this.entryRepository.saveAll(entries)

            return entry
        }

        const newEntry = new IndexEntry(path, objectHash, IndexEntry.STATUS.Added)

        entries.push(newEntry)

        await this.entryRepository.saveAll(entries)

        return newEntry
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
