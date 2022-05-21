import Item from 'Entities/Item'
import IItemsRepository from 'Repositories/IItemsRepository'

export default class InMemoryItemsRepository implements IItemsRepository {
  public items: Item[] = []

  public async create(data: Item) {
    const item = new Item(data)

    this.items.push(item)

    return item
  }
}
