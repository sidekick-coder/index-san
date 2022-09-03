import CrudManager from '../../gateways/crud-manager'
import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import ItemService from '../../services/item-service'
import ListItemsDTO from './list-items.dto'

export default class ListItems {
    constructor(
        private readonly drive: DriveManager,
        private readonly crud: CrudManager,
        private readonly workspaceRepository: IWorkspaceRepository,
    ){}

    public async execute({ workspaceId, collectionId  }:ListItemsDTO.Input): Promise<ListItemsDTO.Output> {

        const service = new ItemService(this.drive, this.workspaceRepository)

        const collection = await service.loadCollection(workspaceId, collectionId)

        this.crud.use(collection.crudName).useDrive(this.drive)

        const items = await this.crud.list(collection.path)

        const data = items.map(i => ({
            ...i,
            collectionId: collection.id,
            workspaceId: workspaceId
        }))

        return {
            data: data
        }
    }
}