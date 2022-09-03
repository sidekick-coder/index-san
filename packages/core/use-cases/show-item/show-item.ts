import CrudManager from '../../gateways/crud-manager'
import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import ItemService from '../../services/item-service'
import ShowItemDTO from './show-item.dto'

export default class ShowItem {
    constructor(
        private readonly drive: DriveManager,
        private readonly crud: CrudManager,
        private readonly workspaceRepository: IWorkspaceRepository,
    ){}

    public async execute({ workspaceId, collectionId, itemId }:ShowItemDTO.Input): Promise<ShowItemDTO.Output> {
        const service = new ItemService(this.drive, this.workspaceRepository)

        const collection = await service.loadCollection(workspaceId, collectionId)

        this.crud.use(collection.crudName).useDrive(this.drive)

        const item = await this.crud.findById(collection.path, itemId)

        if (!item) throw new Error('Item not found')

        const data = {
            ...item,
            collectionId,
            workspaceId,
        }

        return {
            data
        }
    }
}