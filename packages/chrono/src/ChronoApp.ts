import IDrive from './gateways/IDrive'
import IHash from './gateways/IHash'

import IBlobRepository from './repositories/IBlobRepository'
import IObjectRepository from './repositories/IObjectRepository'
import IStageItemRepository from './repositories/IStageItemRepository'

import LocalObjectRepository from './repositories/implementations/LocalObjectRepository'
import LocalBlobRepository from './repositories/implementations/LocalBlobRepository'
import LocalStageItemRepository from './repositories/implementations/LocalStageItemRepository'

import InitUseCase from './use-cases/InitUseCase'
import CatFileUseCase from './use-cases/CatFileUseCase'
import HashFileUseCase from './use-cases/HashFileUseCase'
import RemoveStageItemUseCase from './use-cases/RemoveStageItemUseCase'
import AddStateItemUseCase from './use-cases/AddStageItemUseCase'
import CommitUseCase from './use-cases/CommitUseCase'

export default class ChronoApp {
    private readonly objectRepository: IObjectRepository
    private readonly blobRepository: IBlobRepository

    private readonly objectTemporaryRepository: IObjectRepository
    private readonly blobTemporaryRepository: IBlobRepository

    private readonly stageItemRepository: IStageItemRepository

    constructor(
        private readonly drive: IDrive,
        private readonly hash: IHash
    ) {
        this.objectRepository = new LocalObjectRepository(drive, hash)
        this.blobRepository = new LocalBlobRepository(drive, hash)

        this.objectTemporaryRepository = new LocalObjectRepository(
            drive,
            hash,
            '.chrono/tmp/objects'
        )

        this.blobTemporaryRepository = new LocalBlobRepository(drive, hash, '.chrono/tmp/blobs')

        this.stageItemRepository = new LocalStageItemRepository(drive)
    }

    public async init() {
        const useCase = new InitUseCase(this.drive)

        await useCase.execute()
    }

    public async hashEntry(path: string) {
        const useCase = new HashFileUseCase(
            this.drive,
            this.objectTemporaryRepository,
            this.blobTemporaryRepository
        )

        return useCase.execute({ path })
    }

    public async catEntry(objectHash: string) {
        const useCase = new CatFileUseCase(this.objectRepository, this.objectTemporaryRepository)

        return useCase.execute({ objectHash })
    }

    public async addEntry(path: string) {
        const useCase = new AddStateItemUseCase(
            this.drive,
            this.stageItemRepository,
            this.objectTemporaryRepository,
            this.blobTemporaryRepository
        )

        return useCase.execute({ path })
    }

    public async removeEntry(path: string) {
        const useCase = new RemoveStageItemUseCase(this.stageItemRepository)

        return useCase.execute({ path })
    }

    public async commit(message: string, body?: string) {
        const useCase = new CommitUseCase(
            this.objectRepository,
            this.objectTemporaryRepository,
            this.blobRepository,
            this.blobTemporaryRepository,
            this.stageItemRepository
        )

        return useCase.execute({ message, body })
    }
}
