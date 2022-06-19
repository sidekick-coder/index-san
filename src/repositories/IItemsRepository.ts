import Item from 'Entities/Item'
import IMetadataRepository from './IMetadataRepository'
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
  _workspacesRepository: IWorkspacesRepository
  _metasRepository: IMetadataRepository
  index(filters?: Filters): Promise<Item[]>
  findOne(filters?: Filters): Promise<Item | null>
  create(item: Item): Promise<Item>
}
