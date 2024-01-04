import IDrive from '../gateways/IDrive'
import IBlobRepository from '../repositories/IBlobRepository'
import IObjectRepository from '../repositories/IObjectRepository'
import HashEntryService from '../services/HashEntryService'

interface Params {
    path: string
}

export default class HashEntryUseCase {
    constructor(
        private readonly drive: IDrive,
        private readonly objectRepository: IObjectRepository,
        private readonly blobRepository: IBlobRepository
    ) {}

    public async execute({ path }: Params) {
        const service = new HashEntryService(this.drive, this.objectRepository, this.blobRepository)

        return await service.hashEntry(path)
    }
}
