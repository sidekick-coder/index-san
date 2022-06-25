import ItemNotFound from 'Errors/ItemNotFound'
import IItemsRepository from 'Repositories/IItemsRepository'

interface Params {
  id: string
  name?: string
  content?: Buffer
}

export default class UpdateItem {
  constructor(public repository: IItemsRepository) {}

  public async execute({ id, name, content }: Params) {
    const item = await this.repository.find(id)

    if (!item) throw new ItemNotFound()

    if (item.type === 'folder' && content) throw new Error('content is only allowed for type file')

    await this.repository.update(item.id, { name }, content)
  }
}
