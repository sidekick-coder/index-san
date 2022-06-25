import ItemNotFound from 'Errors/ItemNotFound'
import IItemsRepository from 'Repositories/IItemsRepository'

interface Params {
  workspaceId: string
  id: string
  name?: string
  content?: Buffer
}

export default class UpdateItem {
  constructor(public repository: IItemsRepository) {}

  public async execute({ workspaceId, id, name, content }: Params) {
    const item = await this.repository.findOne({
      where: { workspaceId, id },
    })

    if (!item) throw new ItemNotFound()

    if (item.type === 'folder' && content) throw new Error('content is only allowed for type file')

    await this.repository.update(
      {
        ...item,
        name: name || item.name,
      },
      content
    )
  }
}
