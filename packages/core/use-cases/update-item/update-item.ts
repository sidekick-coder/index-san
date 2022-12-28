import AppConfig from '../../config/app'
import UpdateItemDTO from './update-item.dto'

export default class UpdateItem {
    constructor(private readonly app: AppConfig) {}

    public async execute({ collectionId, workspaceId, itemId, data }: UpdateItemDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const repository = await this.app.facades.item.createRepositoryFromWorkspace(
            workspace,
            collectionId
        )

        await repository.update(itemId, data)
    }
}
