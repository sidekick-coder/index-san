import IDrive from './gateways/IDrive'
import IHash from './gateways/IHash'
import BlobRepositoryImpl from './repositories/BlobRepositoryImpl'
import IBlobRepository from './repositories/IBlobRepository'
import IObjectRepository from './repositories/IObjectRepository'
import ObjectRepositoryImpl from './repositories/ObjectRepositoryImpl'
import CatFileUseCase from './use-cases/CatFileUseCase'
import HashFileUseCase from './use-cases/HashFileUseCase'
import InitUseCase from './use-cases/InitUseCase'

export default class ChronoApp {
    private readonly objectRepository: IObjectRepository
    private readonly blobRepository: IBlobRepository

    constructor(
        private readonly drive: IDrive,
        private readonly hash: IHash
    ) {
        this.objectRepository = new ObjectRepositoryImpl(drive, hash)
        this.blobRepository = new BlobRepositoryImpl(drive, hash)
    }

    public async init() {
        const useCase = new InitUseCase(this.drive)

        await useCase.execute()
    }

    public async hashFile(path: string) {
        const useCase = new HashFileUseCase(this.drive, this.objectRepository, this.blobRepository)

        await useCase.execute({ path })
    }

    public async catFile(objectHash: string) {
        const useCase = new CatFileUseCase(this.objectRepository)

        return await useCase.execute({ objectHash })
    }
}
