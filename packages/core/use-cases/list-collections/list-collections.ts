import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import ListCollectionsDTO from './list-collections.dto'

export default class ListCollections {
    constructor(private readonly app: AppService){}


    public async execute({ workspaceId }: ListCollectionsDTO.Input): Promise<ListCollectionsDTO.Output> {
        
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        return {
            data: workspace.collections
        }
    }
}