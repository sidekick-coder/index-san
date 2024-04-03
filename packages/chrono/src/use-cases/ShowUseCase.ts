import ChronoObjectCommit from '../entities/ChronoObjectCommit'
import BaseException from '../exceptions/BaseException'
import IDrive from '../gateways/IDrive'
import IBlobRepository from '../repositories/IBlobRepository'
import IObjectRepository from '../repositories/IObjectRepository'
import HelperService from '../services/HelperService'
import TreeService from '../services/TreeService'

interface Params {
    hash: string
    path: string
}

export default class ShowUseCase {
    constructor(
        private readonly drive: IDrive,
        private readonly objectRepository: IObjectRepository,
        private readonly blobRepository: IBlobRepository
    ) {}

    public async execute({ hash, path }: Params) {
        const service = new TreeService(this.objectRepository)
        const object = await this.objectRepository.find(hash)

        if (!object) {
            throw new BaseException('Not found')
        }

        if (object.type !== 'commit') {
            throw new BaseException('Only commits are allowed')
        }

        const commit = new ChronoObjectCommit(object.content, object.hash)

        const entries = await service.findTreeIndex(commit.tree)

        const entry = entries.find((e) => e.fullPath === path)

        if (!entry) {
            throw new BaseException('Not found in tree')
        }

        const entryObject = await this.objectRepository.find(entry.hash)

        if (entryObject?.type !== 'blob') {
            throw new BaseException('Not a blob')
        }        

        return await this.blobRepository.find(entryObject.head.blobHash)
    }
}
