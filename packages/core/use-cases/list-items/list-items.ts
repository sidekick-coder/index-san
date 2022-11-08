import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import ListItemsDTO from './list-items.dto'

export default class ListItems {
    constructor(private readonly service: AppService){}

    public async execute({ workspaceId, collectionId  }:ListItemsDTO.Input): Promise<ListItemsDTO.Output> {

        const workspace = await WorkspaceService.from(this.service, workspaceId)

        const collection = await workspace.collection(collectionId)

        const items = await collection.list()
        
        return {
            data: items
        }
    }
}