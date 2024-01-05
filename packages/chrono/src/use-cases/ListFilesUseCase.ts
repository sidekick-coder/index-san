import IHeadEntryRepository from '../repositories/IHeadEntryRepository'
import IIndexEntryRepository from '../repositories/IIndexEntryRepository'

interface Params {
    stage: boolean
}
export default class ListFilesUseCase {
    constructor(
        private readonly indexEntryRepository: IIndexEntryRepository,
        private readonly headEntryRepository: IHeadEntryRepository
    ) {}

    async execute({ stage }: Params) {
        if (stage) {
            return this.indexEntryRepository.findAll()
        }

        return this.headEntryRepository.findAll()
    }
}
