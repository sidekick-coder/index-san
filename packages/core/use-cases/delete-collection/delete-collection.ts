import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import DeleteCollectionsDTO from './delete-collection.dto'

export default class DeleteCollection {
    constructor(private readonly app: AppService) {}

    public async execute({ workspaceId, collectionId }: DeleteCollectionsDTO.Input) {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        await workspace.app.repositories.collection.destroy(collectionId)
    }
}
