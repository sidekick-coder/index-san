import type AppConfig from '../../config/app'
import type ListItemsDTO from './list-items.dto'

export default class ListItems {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, collectionId }: ListItemsDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const repository = await this.app.facades.item.createRepositoryFromWorkspace(
            workspace,
            collectionId
        )

        const items = await repository.list()

        return {
            data: items,
        }
    }
}
