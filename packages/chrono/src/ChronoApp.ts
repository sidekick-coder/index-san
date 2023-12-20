import IDrive from "./gateways/IDrive";
import IHash from "./gateways/IHash";
import ObjectService from "./services/ObjectService";
import InitUseCase from "./use-cases/InitUseCase";

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
}