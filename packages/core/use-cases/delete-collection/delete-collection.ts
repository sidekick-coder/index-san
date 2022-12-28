import AppConfig from '../../config/app'
import DeleteCollectionsDTO from './delete-collection.dto'

export default class DeleteCollection {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, collectionId }: DeleteCollectionsDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const repository = this.app.facades.collection.createRepository(workspace)

        await repository.destroy(collectionId)
    }
}
