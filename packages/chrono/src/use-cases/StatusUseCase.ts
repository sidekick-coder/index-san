import { IndexEntryStatus } from '../entities/IndexEntry'
import IDrive from '../gateways/IDrive'
import IBlobRepository from '../repositories/IBlobRepository'
import IIndexEntryRepository from '../repositories/IIndexEntryRepository'
import IObjectRepository from '../repositories/IObjectRepository'
import HashEntryService from '../services/HashEntryService'

export default class StatusUseCase {
    constructor(
        private readonly drive: IDrive,
        private readonly objectRepository: IObjectRepository,
        private readonly blobRepository: IBlobRepository,
        private readonly entryRepository: IIndexEntryRepository
    ) {}

    public async execute() {
        const service = new HashEntryService(this.drive, this.objectRepository, this.blobRepository)

        const allFiles = await this.drive.readdir('.', {
            recursive: true,
            exclude: ['.chrono'],
            onlyFiles: true,
        })

        const entries = await this.entryRepository.findAll()

        const untracked = allFiles.filter((f) => !entries.some((e) => e.path === f))
        const added = entries
            .filter((e) => [IndexEntryStatus.Added, IndexEntryStatus.Modified].includes(e.status))
            .map((e) => e.path)

        const changed = [] as string[]

        for await (const entry of entries) {
            const { objectHash } = await service.hashEntry(entry.path)

            if (objectHash !== entry.hash && entry.status === IndexEntryStatus.Unmodified) {
                changed.push(entry.path)
            }
        }

        return {
            untracked,
            changed,
            added,
        }
    }
}
