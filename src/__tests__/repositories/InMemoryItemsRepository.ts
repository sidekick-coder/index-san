import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'
import IItemsRepository from 'Repositories/IItemsRepository'

export default class InMemoryItemsRepository implements IItemsRepository {
  public items: Item[] = []

  public async index(workspace: Workspace) {
    const items = this.items.filter((item) => item.workspaceId === workspace.id)

    return items
  }

  public async findByPath(workspace: Workspace, path: string) {
    const item = this.items
      .filter((item) => item.workspaceId === workspace.id)
      .find((item) => item.path === path)

    return item ?? null
  }

  public async create(workspace: Workspace, data: Item) {
    const item = new Item({
      ...data,
      workspaceId: workspace.id,
    })

    this.items.push(item)

    return item
  }
}
