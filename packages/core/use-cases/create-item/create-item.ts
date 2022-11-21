import Item from '../../entities/item'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import CreateItemDTO from './create-item.dto'

export default class CreateItem {
    constructor(private readonly app: AppService) {}

    public async execute({
        collectionId,
        workspaceId,
        data,
    }: CreateItemDTO.Input): Promise<CreateItemDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const collection = await workspace.collection(collectionId)

        const item = new Item(data)

        await collection.create(item)

        return {
            data: {
                ...item,
                workspaceId,
                collectionId,
            },
        }
    }
}
