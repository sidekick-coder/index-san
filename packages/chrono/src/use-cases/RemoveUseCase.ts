import IStageItemRepository from '../repositories/IStageItemRepository'

interface Params {
    path: string
}

export default class RemoveUseCase {
    constructor(private readonly stageItemRepository: IStageItemRepository) {}

    async execute({ path }: Params) {
        return this.stageItemRepository.removeByPath(path)
    }
}
