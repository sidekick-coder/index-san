import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'

export default interface IItemsRepository {
  create(workspace: Workspace, item: Item): Promise<Item>
  findByPath(workspace: Workspace, path: string): Promise<Item | null>
}
