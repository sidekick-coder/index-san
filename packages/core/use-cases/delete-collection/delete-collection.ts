import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import DeleteCollectionsDTO from './delete-collection.dto'

export default class DeleteCollection {
    constructor(private readonly app: AppService) {}

    public async execute({ workspaceId, collectionId }: DeleteCollectionsDTO.Input) {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const index = workspace.collections.findIndex((c) => c.id === collectionId)

        if (index === -1) throw new Error('Collection not found')

        workspace.collections.splice(index, 1)

        await workspace.save()
    }
}
