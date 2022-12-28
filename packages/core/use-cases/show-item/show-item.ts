import AppConfig from '../../config/app'
import ShowItemDTO from './show-item.dto'

export default class ShowItem {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, collectionId, itemId }: ShowItemDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const repository = await this.app.facades.item.createRepositoryFromWorkspace(
            workspace,
            collectionId
        )

        const item = await repository.show(itemId)

        return {
            data: item,
        }
    }
}
