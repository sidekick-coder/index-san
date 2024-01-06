import HeadEntry from '../../entities/HeadEntry'
import IDrive from '../../gateways/IDrive'
import HelperService from '../../services/HelperService'
import TreeService from '../../services/TreeService'
import IHeadEntryRepository from '../IHeadEntryRepository'
import IObjectRepository from '../IObjectRepository'

export default class LocalHeadEntryRepository implements IHeadEntryRepository {
    private readonly drive: IDrive
    private readonly objectRepository: IObjectRepository
    private readonly treeService: TreeService

    constructor(drive: IDrive, objectRepository: IObjectRepository) {
        this.drive = drive
        this.objectRepository = objectRepository
        this.treeService = new TreeService(objectRepository)
    }

    public findAll: IHeadEntryRepository['findAll'] = async () => {
        const contents = await this.drive.read('.chrono/head')

        const hash = HelperService.decode(contents)

        if (!hash) {
            return []
        }

        const object = await this.objectRepository.findOrFail(hash)

        if (object.type === 'commit') {
            const entries = await this.treeService.findTreeIndex(object.head.tree)

            return entries.map((entry) =>
                HeadEntry.from({
                    path: entry.fullPath,
                    hash: entry.hash,
                    type: entry.type as any,
                })
            )
        }

        return []
    }
}
