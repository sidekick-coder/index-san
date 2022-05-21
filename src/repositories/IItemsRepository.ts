import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'

export interface IndexFilters {
  // workspace-parent-path
  parentPath?: string
}

export default interface IItemsRepository {
  index(workspace: Workspace, filters?: IndexFilters): Promise<Item[]>
  create(workspace: Workspace, item: Item): Promise<Item>
  findByPath(workspace: Workspace, path: string): Promise<Item | null>
}
