import type AppConfig from '../../config/app'
import type DeleteItemDTO from './delete-item.dto'

export default class UpdateItem {
    constructor(private readonly app: AppConfig) {}

    public async execute({ collectionId, workspaceId, itemId }: DeleteItemDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const repository = await this.app.facades.item.createRepositoryFromWorkspace(
            workspace,
            collectionId
        )

        await repository.destroy(itemId)
    }
}
