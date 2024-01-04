import IEntryRepository from '../repositories/IEntryRepository'

export default class ListFilesUseCase {
    constructor(private readonly entryRepository: IEntryRepository) {}

    async execute() {
        return this.entryRepository.findAll()
    }
}
