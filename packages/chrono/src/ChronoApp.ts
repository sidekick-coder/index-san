import IDrive from './gateways/IDrive'
import IHash from './gateways/IHash'
import LocalBlobRepository from './repositories/implementations/LocalBlobRepository'
import IBlobRepository from './repositories/IBlobRepository'
import IObjectRepository from './repositories/IObjectRepository'
import LocalObjectRepository from './repositories/implementations/LocalObjectRepository'
import CatFileUseCase from './use-cases/CatFileUseCase'
import HashFileUseCase from './use-cases/HashFileUseCase'
import InitUseCase from './use-cases/InitUseCase'

export default class ChronoApp {
    private readonly objectRepository: IObjectRepository
    private readonly blobRepository: IBlobRepository

    private readonly objectTemporaryRepository: IObjectRepository
    private readonly blobTemporaryRepository: IBlobRepository

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
    }

    public async init() {
        const useCase = new InitUseCase(this.drive)

        await useCase.execute()
    }

    public async hashFile(path: string) {
        const useCase = new HashFileUseCase(
            this.drive,
            this.objectTemporaryRepository,
            this.blobTemporaryRepository
        )

        return useCase.execute({ path })
    }

    public async catFile(objectHash: string) {
        const useCase = new CatFileUseCase(this.objectTemporaryRepository)

        return useCase.execute({ objectHash })
    }
}
