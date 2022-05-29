import ItemNotFound from 'Errors/ItemNotFound'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IItemsRepository from 'Repositories/IItemsRepository'
import IMetadataRepository from 'Repositories/IMetadataRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

interface Args {
  workspaceId: string
  path: string
  data: any
}
export default class SaveItemMetadata {
  constructor(
    private workspaceRepository: IWorkspacesRepository,
    private itemsRepository: IItemsRepository,
    private metadataRepository: IMetadataRepository
  ) {}

  public async execute({ workspaceId, path, data }: Args) {
    const workspace = await this.workspaceRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound(workspaceId)

    const item = await this.itemsRepository.findByPath(workspace, path)

    if (!item) throw new ItemNotFound(workspaceId, path)

    return await this.metadataRepository.save(workspace, item, data)
  }
}
