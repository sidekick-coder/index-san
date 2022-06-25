import ItemNotFound from 'Errors/ItemNotFound'
import IItemsRepository from 'Repositories/IItemsRepository'

interface Params {
  id: string
}

export default class DeleteItem {
  constructor(public repository: IItemsRepository) {}

  public async execute({ id }: Params) {
    const item = await this.repository.find(id)

    if (!item) throw new ItemNotFound()

    await this.repository.delete(item.id)
  }
}
