import Metadata from 'Entities/Metadata'
export interface Filters {
  where: {
    itemId?: string[]
    workspaceId?: string
  }
}

export default interface IMetadataRepository {
  index(filters?: Filters): Promise<Metadata[]>
  findOne(filters?: Filters): Promise<Metadata | null>
  create(metadata: Metadata): Promise<Metadata>
}
