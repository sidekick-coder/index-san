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
import HashFileUseCase from './use-cases/HashEntryUseCase'
import RemoveUseCase from './use-cases/RemoveUseCase'
import CommitUseCase from './use-cases/CommitUseCase'
import StatusUseCase from './use-cases/StatusUseCase'
import IEntryRepository from './repositories/IEntryRepository'
import LocalEntryRepository from './repositories/implementations/LocalEntryRepository'
import AddUseCase from './use-cases/AddUseCase'
import ListFilesUseCase from './use-cases/ListFilesUseCase'
import HashEntryService from './services/HashEntryService'

export default class ChronoApp {
    private readonly objectRepository: IObjectRepository
    private readonly blobRepository: IBlobRepository

    private readonly stageItemRepository: IStageItemRepository
    private readonly entryRepository: IEntryRepository

    private readonly hashEntryService: HashEntryService

    constructor(
        private readonly drive: IDrive,
        private readonly hash: IHash
    ) {
        this.objectRepository = new LocalObjectRepository(drive, hash)
        this.blobRepository = new LocalBlobRepository(drive, hash)

        this.stageItemRepository = new LocalStageItemRepository(drive)
        this.entryRepository = new LocalEntryRepository(drive, hash)

        this.hashEntryService = new HashEntryService(
            drive,
            this.objectRepository,
            this.blobRepository
        )
    }

    public async init() {
        const useCase = new InitUseCase(this.drive)

        await useCase.execute()
    }

    public async hashEntry(path: string) {
        const useCase = new HashFileUseCase(this.drive, this.objectRepository, this.blobRepository)

        return useCase.execute({ path })
    }

    public async catEntry(objectHash: string) {
        const useCase = new CatFileUseCase(this.objectRepository)

        return useCase.execute({ objectHash })
    }

    public async addEntry(path: string) {
        const useCase = new AddUseCase(
            this.drive,
            this.objectRepository,
            this.blobRepository,
            this.entryRepository
        )

        return useCase.execute({ path })
    }

    public async removeEntry(path: string) {
        const useCase = new RemoveUseCase(this.drive, this.entryRepository)

        return useCase.execute({ path })
    }

    public async list() {
        const useCase = new ListFilesUseCase(this.entryRepository)

        return useCase.execute()
    }

    public async commit(message: string, body?: string) {
        const useCase = new CommitUseCase(
            this.drive,
            this.objectRepository,
            this.blobRepository,
            this.entryRepository
        )

        return useCase.execute({ message, body })
    }

    public async status() {
        const useCase = new StatusUseCase(this.drive, this.entryRepository)

        return useCase.execute()
    }
}
