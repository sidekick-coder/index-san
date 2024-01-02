import IObjectRepository from '../repositories/IObjectRepository'

interface CatUseCaseParams {
    objectHash: string
}

export default class CatFileUseCase {
    constructor(private readonly objectRepository: IObjectRepository) {}

    async execute({ objectHash }: CatUseCaseParams) {
        const result = await this.objectRepository.findOrFail(objectHash)

        return result.serialize()
    }
}
