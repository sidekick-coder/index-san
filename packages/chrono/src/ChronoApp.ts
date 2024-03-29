import IDrive from './gateways/IDrive'
import IHash from './gateways/IHash'

import IBlobRepository from './repositories/IBlobRepository'
import IObjectRepository from './repositories/IObjectRepository'
import IIndexEntryRepository from './repositories/IIndexEntryRepository'
import IHeadEntryRepository from './repositories/IHeadEntryRepository'

import LocalObjectRepository from './repositories/implementations/LocalObjectRepository'
import LocalBlobRepository from './repositories/implementations/LocalBlobRepository'
import LocalIndexEntryRepository from './repositories/implementations/LocalIndexEntryRepository'
import LocalHeadEntryRepository from './repositories/implementations/LocalHeadEntryRepository'

import InitUseCase from './use-cases/InitUseCase'
import CatFileUseCase from './use-cases/CatFileUseCase'
import HashEntryUseCase from './use-cases/HashEntryUseCase'
import RemoveUseCase from './use-cases/RemoveUseCase'
import CommitUseCase from './use-cases/CommitUseCase'
import StatusUseCase from './use-cases/StatusUseCase'
import AddUseCase from './use-cases/AddUseCase'
import ListFilesUseCase from './use-cases/ListFilesUseCase'
import CheckoutUseCase from './use-cases/CheckoutUseCase'
import LogUseCase from './use-cases/LogUseCase'

export default class ChronoApp {
    private readonly drive: IDrive
    private readonly hash: IHash

    private readonly objectRepository: IObjectRepository
    private readonly blobRepository: IBlobRepository
    private readonly indexEntryRepository: IIndexEntryRepository
    private readonly headEntryRepository: IHeadEntryRepository

    constructor(drive: IDrive, hash: IHash) {
        this.drive = drive
        this.hash = hash

        this.objectRepository = new LocalObjectRepository(drive, hash)
        this.blobRepository = new LocalBlobRepository(drive, hash)
        this.indexEntryRepository = new LocalIndexEntryRepository(drive)
        this.headEntryRepository = new LocalHeadEntryRepository(drive, this.objectRepository)
    }

    public async hasRepository() {
        return await this.drive.exists('.chrono')
    }

    public async init() {
        const useCase = new InitUseCase(this.drive)

        await useCase.execute()
    }

    public async hashEntry(path: string) {
        const useCase = new HashEntryUseCase(this.drive, this.objectRepository, this.blobRepository)

        return useCase.execute({ path })
    }

    public async catEntry(objectHash: string) {
        const useCase = new CatFileUseCase(this.objectRepository)

        return useCase.execute({ objectHash })
    }

    public async addEntry(...path: string[]) {
        const useCase = new AddUseCase(
            this.drive,
            this.objectRepository,
            this.blobRepository,
            this.indexEntryRepository,
            this.headEntryRepository
        )

        return useCase.execute({ path })
    }

    public async removeEntry(path: string) {
        const useCase = new RemoveUseCase(
            this.drive,
            this.indexEntryRepository,
            this.headEntryRepository
        )

        return useCase.execute({ path })
    }

    public async list(stage = false) {
        const useCase = new ListFilesUseCase(this.indexEntryRepository, this.headEntryRepository)

        return useCase.execute({ stage })
    }

    public async commit(message: string, body?: string) {
        const useCase = new CommitUseCase(
            this.drive,
            this.objectRepository,
            this.blobRepository,
            this.indexEntryRepository
        )

        return useCase.execute({ message, body })
    }

    public async status() {
        const useCase = new StatusUseCase(
            this.drive,
            this.objectRepository,
            this.blobRepository,
            this.indexEntryRepository
        )

        return useCase.execute()
    }

    public async checkout(path: string, hash: string) {
        const useCase = new CheckoutUseCase(this.drive, this.objectRepository, this.blobRepository)

        return useCase.execute({ hash, path })
    }

    public async log() {
        const useCase = new LogUseCase(this.objectRepository)

        return useCase.execute()
    }
}
