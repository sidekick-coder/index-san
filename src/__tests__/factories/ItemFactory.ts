import { v4 as uuid } from 'uuid'

import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'
import IItemsRepository from 'Repositories/IItemsRepository'

export default class ItemFactory {
  constructor(private itemsRepository: IItemsRepository) {}

  public async create(workspace: Workspace, data?: Partial<Item>): Promise<Item> {
    const path = uuid()

    const item = new Item({
      name: path,
      path,
      workspaceId: workspace.id,
      config: {},
      ...data,
    })

    return await this.itemsRepository.create(workspace, item)
  }

  public async createMany(workspace: Workspace, data?: Partial<Item>, count = 5): Promise<Item[]> {
    const items = []

    for (let i = 0; i < count; i++) {
      const item = await this.create(workspace, data)

      items.push(item)
    }

    return items
  }
}
