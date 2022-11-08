
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import DeleteItemDTO from './delete-item.dto'

export default class UpdateItem {
    constructor(private readonly appService: AppService){}

    public async execute({ collectionId, workspaceId, itemId }: DeleteItemDTO.Input): Promise<void> {
        const workspace = await WorkspaceService.from(this.appService, workspaceId)

        const collection = await workspace.collection(collectionId)

        await collection.delete(itemId)
    }
}