import Item from 'Entities/Item'
import IItemsRepository from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'

export default class CreateItem {
  constructor(
    private workspaceRepository: IWorkspacesRepository,
    private readonly repository: IItemsRepository
  ) {}

  public async execute(data: Item) {
    const workspace = await this.workspaceRepository.findById(data.workspaceId)

    if (!workspace) {
      throw new WorkspaceNotFound(data.workspaceId)
    }

    const item = new Item(data)

    return this.repository.create(item)
  }
}
