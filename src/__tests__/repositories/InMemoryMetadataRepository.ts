import Metadata from 'Entities/Metadata'
import Workspace from 'Entities/Workspace'
import IMetadataRepository, { IndexFilters } from 'Repositories/IMetadataRepository'

export default class InMemoryMetadataRepository implements IMetadataRepository {
  public metas = new Map<string, Metadata>()
  public async index(workspace: Workspace, filters?: IndexFilters) {
    return Object.fromEntries(this.metas)
  }
}
