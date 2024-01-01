import IObjectRepository from '../repositories/IObjectRepository'

interface CatUseCaseParams {
    objectHash: string
}

export default class CatFileUseCase {
    constructor(
        private readonly objectRepository: IObjectRepository,
        private readonly objectTemporaryRepository: IObjectRepository
    ) {}

    async execute({ objectHash }: CatUseCaseParams) {
        let result = await this.objectRepository.find(objectHash)
        let isTemporary = false

        if (!result) {
            result = await this.objectTemporaryRepository.find(objectHash)
            isTemporary = !!result
        }

        return {
            isTemporary,
            object: result?.serialize() ?? null,
        }
    }
}
