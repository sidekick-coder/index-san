import AppConfig from '../../config/app'
import UpdateCollectionsDTO from './update-collection.dto'

export default class UpdateCollection {
    constructor(private readonly app: AppConfig) {}

    public collectionsFilename = '.is/collections.json'

    public async execute({ workspaceId, collectionId, data }: UpdateCollectionsDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const repository = this.app.facades.collection.createRepository(workspace)

        return repository.update(collectionId, data)
    }
}
