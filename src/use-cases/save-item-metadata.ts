import ItemNotFound from 'Errors/ItemNotFound'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IItemsRepository from 'Repositories/IItemsRepository'
import IMetadataRepository from 'Repositories/IMetadataRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

interface Args {
  workspaceId: string
  itemId: string
  data: any
}
export default class SaveItemMetadata {
  constructor(private metadataRepository: IMetadataRepository) {}

  public async execute({ workspaceId, itemId, data }: Args) {
    return await this.metadataRepository.create({
      ...data,
      workspaceId,
      itemId,
    })
  }
}
