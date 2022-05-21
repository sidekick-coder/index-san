import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'
import IItemsRepository, { IndexFilters } from 'Repositories/IItemsRepository'

export default class InMemoryItemsRepository implements IItemsRepository {
  public items: Item[] = []

  public async index(workspace: Workspace, filters: IndexFilters) {
    const items = this.items.filter((item) => item.workspaceId === workspace.id)

    const parentPath = filters?.parentPath ?? ''

    if (!parentPath) return items

    return items
      .filter((item) => item.path !== parentPath)
      .filter((item) => item.path.startsWith(parentPath))
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
