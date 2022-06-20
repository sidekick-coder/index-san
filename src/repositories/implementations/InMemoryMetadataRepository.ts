import Metadata from 'Entities/Metadata'
import lodash from 'lodash'
import IMetadataRepository, { Filters } from 'Repositories/IMetadataRepository'

export default class InMemoryMetadataRepository implements IMetadataRepository {
  public metas: Metadata[] = []

  public async index(filters?: Filters) {
    const where = filters?.where ?? {}

    return lodash(this.metas)
      .filter((m) =>
        Object.entries(where).every(([key, value]) => {
          if (Array.isArray(value)) return value.includes(m[key])

          return m[key] === value
        })
      )
      .value()
  }

  public async create(metadata: Metadata) {
    const index = this.metas.findIndex((meta) => meta.id === metadata.id)

    if (index === -1) this.metas.push(metadata)

    if (index !== -1) this.metas[index] = metadata

    return metadata
  }

  public async findOne(filters: Filters) {
    const [metadata] = await this.index(filters)

    return metadata || null
  }
}
