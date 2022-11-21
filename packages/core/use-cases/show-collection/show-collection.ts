import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import ShowCollectionsDTO from './show-collection.dto'

export default class ShowCollection {
    constructor(private readonly app: AppService) {}

    public async execute({
        workspaceId,
        collectionId,
    }: ShowCollectionsDTO.Input): Promise<ShowCollectionsDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const collection = workspace.collections.find((c) => c.id === collectionId)

        if (!collection) throw new Error('Collection not found')

        collection.workspaceId = workspaceId

        return {
            data: collection,
        }
    }
}
