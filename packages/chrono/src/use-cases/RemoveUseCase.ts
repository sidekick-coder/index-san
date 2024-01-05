import { IndexEntryStatus } from '../entities/IndexEntry'
import IDrive from '../gateways/IDrive'
import IHeadEntryRepository from '../repositories/IHeadEntryRepository'
import IIndexEntryRepository from '../repositories/IIndexEntryRepository'

interface Params {
    path: string
}

export default class RemoveUseCase {
    constructor(
        private readonly drive: IDrive,
        private readonly indexEntryRepository: IIndexEntryRepository,
        private readonly headEntryRepository: IHeadEntryRepository
    ) {}

    public async removeFileEntry(path: string) {
        const indexEntries = await this.indexEntryRepository.findAll()
        const headEntries = await this.headEntryRepository.findAll()

        const indexEntry = indexEntries.find((entry) => entry.path === path)
        const headEntry = headEntries.find((entry) => entry.path === path)

        if (!indexEntry) return

        if (headEntry) {
            indexEntry.status = IndexEntryStatus.Unmodified
            indexEntry.hash = headEntry.hash

            await this.indexEntryRepository.saveAll(indexEntries)

            return
        }

        indexEntries.splice(indexEntries.indexOf(indexEntry), 1)

        await this.indexEntryRepository.saveAll(indexEntries)
    }

    public async removeDirectoryEntry(path: string) {
        const files = await this.drive.readdir(path, {
            recursive: true,
            onlyFiles: true,
        })

        for await (const file of files) {
            await this.removeFileEntry(`${path}/${file}`)
        }
    }

    async execute({ path }: Params) {
        if (await this.drive.isFile(path)) {
            await this.removeFileEntry(path)

            return
        }

        await this.removeDirectoryEntry(path)
    }
}
