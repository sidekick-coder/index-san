import ChronoObject from '../entities/ChronoObject'
import ChronoObjectTree from '../entities/ChronoObjectTree'
import IBlobRepository from '../repositories/IBlobRepository'
import IObjectRepository from '../repositories/IObjectRepository'
import IStageItemRepository from '../repositories/IStageItemRepository'
import HashFileUseCase from './HashFileUseCase'

interface Params {
    message: string
    body?: string
}

export default class CommitUseCase {
    public hashFileUseCase: HashFileUseCase

    constructor(
        private readonly objectRepository: IObjectRepository,
        private readonly objectTemporaryRepository: IObjectRepository,
        private readonly blobRepository: IBlobRepository,
        private readonly blobTemporaryRepository: IBlobRepository,
        private readonly stageItemRepository: IStageItemRepository
    ) {}

    async execute({ message, body }: Params) {
        // get stage
        const items = await this.stageItemRepository.findAll()

        // copy objects & blobs from .chrono/tmp to .chrono/objects & .chrono/blobs
        for await (const item of items) {
            const object = await this.objectTemporaryRepository.findOrFail(item.hash)
            await this.objectRepository.copyFrom(this.objectTemporaryRepository, item.hash)

            if (object.type === 'blob') {
                await this.blobRepository.copyFrom(
                    this.blobTemporaryRepository,
                    object.head.blobHash
                )
            }
        }

        // create tree
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

        return this.objectRepository.save(commit)
    }
}
