import ChronoObject from '../entities/ChronoObject'
import ChronoObjectTree from '../entities/ChronoObjectTree'
import IDrive from '../gateways/IDrive'
import IBlobRepository from '../repositories/IBlobRepository'
import IObjectRepository from '../repositories/IObjectRepository'
import IStageItemRepository from '../repositories/IStageItemRepository'
import HelperService from '../services/HelperService'
import HashFileUseCase from './HashFileUseCase'

interface Params {
    message: string
    body?: string
}

export default class CommitUseCase {
    public hashFileUseCase: HashFileUseCase

    constructor(
        private readonly drive: IDrive,
        private readonly objectRepository: IObjectRepository,
        private readonly blobRepository: IBlobRepository,
        private readonly stageItemRepository: IStageItemRepository
    ) {}

    async execute({ message, body }: Params) {
        // get stage
        const items = await this.stageItemRepository.findAll()

        // create & save tree
        const tree = ChronoObjectTree.fromEntries(items)

        const { objectHash: treeHash } = await this.objectRepository.save(tree)

        // create commit
        const commit = ChronoObject.from(
            {
                type: 'commit',
                tree: treeHash,
                date: new Date().toISOString(),
                message: message || '',
            },
            body
        )

        const result = await this.objectRepository.save(commit)

        // update HEAD
        await this.drive.write('.chrono/HEAD', HelperService.encode(result.objectHash))

        // clear stage
        await this.stageItemRepository.saveAll([])

        return commit
    }
}
