import Item from 'Entities/Item'
import Metadata from 'Entities/Metadata'
import Workspace from 'Entities/Workspace'

export interface IndexFilters {
  paths?: string[]
}

type IndexResult = Record<string, Metadata>

export default interface IMetadataRepository {
  index(workspace: Workspace, filters?: IndexFilters): Promise<IndexResult>
  save(workspace: Workspace, item: Item, metadata: Metadata): Promise<Metadata>
}
