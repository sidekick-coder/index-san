import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IConfigsRepository from 'Repositories/IConfigsRepository'
import IItemsRepository, { IndexFilters } from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

interface Args {
  workspaceId: string
  filters?: IndexFilters
}

export default class ListItems {
  constructor(
    private workspacesRepository: IWorkspacesRepository,
    private itemsRepository: IItemsRepository,
    private configsRepository: IConfigsRepository
  ) {}

  public async execute({ workspaceId, filters }: Args) {
    const workspace = await this.workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound(workspaceId)

    const items = await this.itemsRepository.index(workspace, filters)

    const paths = items.map((item) => item.path)

    const configs = await this.configsRepository.index(workspace, { names: paths })

    configs.forEach((config) => {
      const item = items.find((item) => item.path === config.name)

      if (!item) return

      item.config = config
    })

    return items
  }
}
