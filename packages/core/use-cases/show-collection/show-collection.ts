import type AppConfig from '../../config/app'
import type ShowCollectionsDTO from './show-collection.dto'

export default class ShowCollection {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, collectionId }: ShowCollectionsDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const repository = this.app.facades.collection.createRepository(workspace)

        const collection = await repository.show(collectionId)

        return {
            data: collection,
        }
    }
}
