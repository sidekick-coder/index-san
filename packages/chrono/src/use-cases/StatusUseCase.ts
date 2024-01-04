import { ChronoEntryStatus } from '../entities/ChronoEntry'
import IDrive from '../gateways/IDrive'
import IEntryRepository from '../repositories/IEntryRepository'

export default class StatusUseCase {
    constructor(
        private readonly drive: IDrive,
        private readonly entryRepository: IEntryRepository
    ) {}

    public async execute() {
        const allFiles = await this.drive.readdir('.', {
            recursive: true,
            exclude: ['.chrono'],
            onlyFiles: true,
        })

        const entries = await this.entryRepository.findAll()

        const untracked = allFiles.filter((f) => {
            return !entries.some((e) => e.path === f)
        })

        const added = entries.filter((e) => e.status === ChronoEntryStatus.Added).map((e) => e.path)
        const modified = entries
            .filter((e) => e.status === ChronoEntryStatus.Modified)
            .map((e) => e.path)

        return {
            untracked,
            modified,
            added,
        }
    }
}
