import Metadata from 'Entities/Metadata'
import ItemNotFound from 'Errors/ItemNotFound'
import IItemsRepository from 'Repositories/IItemsRepository'
import IMetadataRepository, { Filters } from 'Repositories/IMetadataRepository'

export default class InMemoryMetadataRepository implements IMetadataRepository {
  public metas: Metadata[] = []

  public async index(filters?: Filters) {
    return this.metas
  }

  public async create(metadata: Metadata) {
    const index = this.metas.findIndex((meta) => meta.id === metadata.id)

    if (index === -1) this.metas.push(metadata)

    if (index !== -1) this.metas[index] = metadata

    return metadata
  }
}
