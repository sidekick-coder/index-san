import CollectionNotFound from '../../exceptions/collection-not-found'
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

        const collection = await workspace.app.repositories.collection.show(collectionId)

        if (!collection) throw new CollectionNotFound(collectionId)

        collection.workspaceId = workspaceId

        return {
            data: collection,
        }
    }
}
