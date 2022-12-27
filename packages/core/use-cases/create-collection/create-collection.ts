import Collection from '../../entities/collection'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import CreateCollectionDTO from './create-collection.dto'

export default class CreateCollection {
    constructor(private readonly app: AppService) {}

    public async execute({
        workspaceId,
        data,
    }: CreateCollectionDTO.Input): Promise<CreateCollectionDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const collection = await workspace.app.repositories.collection.create(
            new Collection(data, data.id)
        )

        return {
            data: collection,
        }
    }
}
