import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import ShowItemDTO from './show-item.dto'

export default class ShowItem {
    constructor(private readonly appService: AppService) {}

    public async execute({
        workspaceId,
        collectionId,
        itemId,
    }: ShowItemDTO.Input): Promise<ShowItemDTO.Output> {
        const workspace = await WorkspaceService.from(this.appService, workspaceId)

        const collection = await workspace.collection(collectionId)

        const item = await collection.show(itemId)

        return {
            data: item,
        }
    }
}
