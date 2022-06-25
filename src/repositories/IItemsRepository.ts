import Item from 'Entities/Item'
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
  index(filters?: Filters): Promise<Item[]>
  findOne(filters?: Filters): Promise<Item | null>
  create(item: Item): Promise<Item>
}
