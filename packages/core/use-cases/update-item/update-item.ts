import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import UpdateItemDTO from './update-item.dto'

export default class UpdateItem {
    constructor(private readonly service: AppService){}

    public async execute({ collectionId, workspaceId, itemId, data }: UpdateItemDTO.Input): Promise<void> {
        const workspace = await WorkspaceService.from(this.service, workspaceId)

        const collection = await workspace.collection(collectionId)

        await collection.update(itemId, data)
    }
}