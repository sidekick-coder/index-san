import Item from 'Entities/Item'
import Metadata from 'Entities/Metadata'
import Workspace from 'Entities/Workspace'
import IMetadataRepository from 'Repositories/IMetadataRepository'

export default class InMemoryMetadataRepository implements IMetadataRepository {
  public metas = new Map<string, Metadata>()

  public async index() {
    return Object.fromEntries(this.metas)
  }

  public async save(workspace: Workspace, item: Item, metadata: Metadata) {
    this.metas.set(item.path, metadata)

    return metadata
  }
}
