import Item from 'Entities/Item'
import IDrive from 'Providers/IDrive'
import IWorkspacesRepository from './IWorkspacesRepository'

interface Where {
  workspaceId?: string
  parentId?: string
  id?: string
}

export interface Filters {
  where?: Where
}

export default interface IItemsRepository {
  drive: IDrive
  index(filters?: Filters): Promise<Item[]>
  find(id: string): Promise<Item | null>
  create(data: Omit<Item, 'id'>, buffer?: Buffer): Promise<Item>
  update(id: string, data: Partial<Item>, buffer?: Buffer): Promise<void>
  delete(id: string): Promise<void>
}
