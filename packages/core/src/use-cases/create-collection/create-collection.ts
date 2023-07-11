import Collection from '../../entities/collection'

import type AppConfig from '../../config/app'
import type CreateCollectionDTO from './create-collection.dto'

export default class CreateCollection {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, data }: CreateCollectionDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const repository = this.app.facades.collection.createRepository(workspace)

        const collection = await repository.create(new Collection(data, data.id))

        return {
            data: collection,
        }
    }
}
