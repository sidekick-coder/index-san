import IDrive from './gateways/IDrive'
import IHash from './gateways/IHash'
import ObjectRepositoryImpl from './repositories/ObjectRepositoryImpl'
import ObjectService from './services/ObjectService'
import HashFileUseCase from './use-cases/HashFileUseCase'
import InitUseCase from './use-cases/InitUseCase'

export default class ChronoApp {
    constructor(
        private readonly drive: IDrive,
        private readonly hash: IHash
    ) {
        this.objectService = new ObjectService(drive, hash)
    }

    public objectService: ObjectService

    public async init() {
        const useCase = new InitUseCase(this.drive)

        await useCase.execute()
    }

    public async hashFile(path: string) {
        const repository = new ObjectRepositoryImpl(this.drive, this.hash)

        const useCase = new HashFileUseCase(this.drive, repository)

        await useCase.execute({ path })
    }
}
