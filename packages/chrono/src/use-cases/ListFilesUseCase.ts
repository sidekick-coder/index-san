import IIndexEntryRepository from '../repositories/IIndexEntryRepository'

export default class ListFilesUseCase {
    constructor(private readonly entryRepository: IIndexEntryRepository) {}

    async execute() {
        return this.entryRepository.findAll()
    }
}
