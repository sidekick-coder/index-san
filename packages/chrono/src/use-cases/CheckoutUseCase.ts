import IDrive from '../gateways/IDrive'
import IBlobRepository from '../repositories/IBlobRepository'
import IObjectRepository from '../repositories/IObjectRepository'
import TreeService from '../services/TreeService'

interface Params {
    path: string
    hash: string
}

export default class CheckoutUseCase {
    constructor(
        private readonly drive: IDrive,
        private readonly objectRepository: IObjectRepository,
        private readonly blobRepository: IBlobRepository
    ) {}

    public async execute({ path, hash }: Params) {
        const service = new TreeService(this.objectRepository)
        const object = await this.objectRepository.findOrFail(hash)

        if (object.type !== 'commit') {
            throw new Error('Object is not a commit')
        }

        const treeIndexEntries = await service.findTreeIndex(object.head.tree)

        const treeEntry = treeIndexEntries.find((entry) => entry.fullPath === path)

        if (!treeEntry) return

        const blobObject = await this.objectRepository.findOrFail(treeEntry.hash)

        if (blobObject.type !== 'blob') {
            throw new Error('Error looking for blob object')
        }

        const contents = await this.blobRepository.findOrFail(blobObject.head.blobHash)

        await this.drive.write(path, contents)
    }
}
