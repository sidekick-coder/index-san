import Item from 'Entities/Item'
import IDrive from 'Providers/IDrive'
import IWorkspacesRepository from './IWorkspacesRepository'

interface Where {
  [key: string]: any
  workspaceId?: string
  parentId?: string
  id?: string
}

export interface Filters {
  where?: Where
  relations?: string[]
}

export default interface IItemsRepository {
  workspacesRepository: IWorkspacesRepository
  drive: IDrive
  index(filters?: Filters): Promise<Item[]>
  findOne(filters?: Filters): Promise<Item | null>
  create(item: Item, buffer?: Buffer): Promise<Item>
  update(item: Item, buffer?: Buffer): Promise<void>
  delete(item: Item): Promise<void>
}
