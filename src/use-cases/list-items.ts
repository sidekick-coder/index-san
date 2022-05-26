import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IItemsRepository, { IndexFilters } from 'Repositories/IItemsRepository'
import IMetadataRepository from 'Repositories/IMetadataRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

interface Args {
  workspaceId: string
  filters?: IndexFilters
}

export default class ListItems {
  constructor(
    private workspacesRepository: IWorkspacesRepository,
    private itemsRepository: IItemsRepository,
    private metadataRepository: IMetadataRepository
  ) {}

  public async execute({ workspaceId, filters }: Args) {
    const workspace = await this.workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound(workspaceId)

    const items = await this.itemsRepository.index(workspace, filters)

    const paths = items.map((item) => item.path)

    const metas = await this.metadataRepository.index(workspace, { paths })

    Object.keys(metas).forEach((name) => {
      const item = items.find((item) => item.path === name)

      if (!item) return

      item.metas = metas[name]
    })

    return items
  }
}
