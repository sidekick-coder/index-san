import Item from 'Entities/Item'
import ItemNotFound from 'Errors/ItemNotFound'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IConfigsRepository from 'Repositories/IConfigsRepository'
import IItemsRepository from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

interface Args {
  workspaceId: string
  path: string
}

export default class ShowItem {
  constructor(
    private workspacesRepository: IWorkspacesRepository,
    private itemsRepository: IItemsRepository,
    private configRepository: IConfigsRepository
  ) {}

  public async execute({ workspaceId, path }: Args): Promise<Item> {
    const workspace = await this.workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound(workspaceId)

    const item = await this.itemsRepository.findByPath(workspace, path)

    if (!item) throw new ItemNotFound(workspaceId, path)

    const config = await this.configRepository.findByName(workspace, item.path)

    item.config = config || {}

    return item
  }
}
