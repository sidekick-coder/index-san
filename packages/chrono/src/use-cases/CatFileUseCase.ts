import BaseException from '../exceptions/BaseException'
import IObjectRepository from '../repositories/IObjectRepository'

interface CatUseCaseParams {
    objectHash: string
}

export default class CatFileUseCase {
    constructor(private readonly objectRepository: IObjectRepository) {}

    async execute({ objectHash }: CatUseCaseParams) {
        const object = await this.objectRepository.find(objectHash)

        if (!object) {
            throw new BaseException(`Object ${objectHash} not found`)
        }

        return object
    }
}
