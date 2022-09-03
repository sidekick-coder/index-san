import CrudManager from '../../gateways/crud-manager'
import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import ItemService from '../../services/item-service'
import DeleteItemDTO from './delete-item.dto'

export default class UpdateItem {
    constructor(
        private readonly drive: DriveManager,
        private readonly crud: CrudManager,
        private readonly workspaceRepository: IWorkspaceRepository,
    ){}

    public async execute({ collectionId, workspaceId, itemId }: DeleteItemDTO.Input): Promise<void> {
        const service = new ItemService(this.drive, this.workspaceRepository)

        const collection = await service.loadCollection(workspaceId, collectionId)

        await this.crud
            .use(collection.crudName)
            .useDrive(this.drive)
            .deleteById(collection.path, itemId)
    }
}