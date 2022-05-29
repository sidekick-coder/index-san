import { v4 as uuid } from 'uuid'

import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'
import IItemsRepository from 'Repositories/IItemsRepository'

export default class ItemFactory {
  constructor(private itemsRepository: IItemsRepository) {}

  public make(data?: Partial<Item>): Item {
    const path = uuid()

    return new Item({
      name: path,
      path,
      workspaceId: '',
      type: 'file',
      ...data,
    })
  }

  public async create(workspace: Workspace, data?: Partial<Item>) {
    const item = this.make({
      workspaceId: workspace.id,
      ...data,
    })

    return await this.itemsRepository.create(workspace, item)
  }

  public async createMany(workspace: Workspace, data?: Partial<Item>, count = 5): Promise<Item[]> {
    const items = []

    for (let i = 0; i < count; i++) {
      const formatted = JSON.stringify(data ?? {}).replace(/%i/g, String(i))

      const item = await this.create(workspace, JSON.parse(formatted))

      items.push(item)
    }

    return items
  }
}
