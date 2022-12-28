import AppConfig from '../../config/app'
import ListCollectionsDTO from './list-collections.dto'

export default class ListCollections {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId }: ListCollectionsDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const repository = this.app.facades.collection.createRepository(workspace)

        const collections = await repository.list()

        return {
            data: collections,
        }
    }
}
