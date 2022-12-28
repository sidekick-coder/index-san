import AppConfig from '../../config/app'
import Item from '../../entities/item'
import CreateItemDTO from './create-item.dto'

export default class CreateItem {
    constructor(private readonly app: AppConfig) {}

    public async execute({ collectionId, workspaceId, data }: CreateItemDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const repository = await this.app.facades.item.createRepositoryFromWorkspace(
            workspace,
            collectionId
        )

        const item = new Item(data, data.id)

        await repository.create(item)

        return {
            data: {
                ...item,
                workspaceId,
                collectionId,
            },
        }
    }
}
