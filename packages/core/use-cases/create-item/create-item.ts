import Item from '../../entities/item'
import CrudManager from '../../gateways/crud-manager'
import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import ItemService from '../../services/item-service'
import CreateItemDTO from './create-item.dto'

export default class CreateItem {
    constructor(
        private readonly drive: DriveManager,
        private readonly crud: CrudManager,
        private readonly workspaceRepository: IWorkspaceRepository,
    ){}

    public async execute({ collectionId, workspaceId, data }: CreateItemDTO.Input): Promise<CreateItemDTO.Output> {
        const service = new ItemService(this.drive, this.workspaceRepository)

        const collection = await service.loadCollection(workspaceId, collectionId)

        this.crud.use(collection.crudName).useDrive(this.drive)

        const item = new Item(data)

        await this.crud.create(collection.path, item)

        return {
            data: {
                ...item,
                workspaceId,
                collectionId
            }
        }
    }
}