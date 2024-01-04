import ChronoEntry from '../entities/ChronoEntry'
import IDrive from '../gateways/IDrive'

import IBlobRepository from '../repositories/IBlobRepository'
import IEntryRepository from '../repositories/IEntryRepository'
import IObjectRepository from '../repositories/IObjectRepository'

import HashEntryService from '../services/HashEntryService'

interface Params {
    path: string
}

export default class AddUseCase {
    constructor(
        private readonly drive: IDrive,
        private readonly objectRepository: IObjectRepository,
        private readonly blobRepository: IBlobRepository,
        private readonly entryRepository: IEntryRepository
    ) {}

    public async addEntry(path: string) {
        const hashService = new HashEntryService(
            this.drive,
            this.objectRepository,
            this.blobRepository
        )

        // list all workspace entries
        const entries = await this.entryRepository.findAll()

        const entry = entries.find((entry) => entry.path === path)

        if (entry) return entry

        const { objectHash } = await hashService.hashEntry(path)

        const newEntry = new ChronoEntry(path, objectHash, ChronoEntry.STATUS.Added)

        entries.push(newEntry)

        await this.entryRepository.saveAll(entries)

        return newEntry
    }

    public async execute({ path }: Params) {
        const result = [] as ChronoEntry[]

        if (await this.drive.isFile(path)) {
            const entry = await this.addEntry(path)

            result.push(entry)

            return result
        }

        const files = await this.drive.readdir(path, {
            recursive: true,
            onlyFiles: true,
        })

        for await (const file of files) {
            const entry = await this.addEntry(`${path}/${file}`)

            result.push(entry)
        }

        return result
    }
}
