import Item from 'Entities/Item'
import IItemsRepository from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import ItemAlreadyExists from 'Errors/ItemAlreadyExists'

export default class CreateItem {
  constructor(
    private workspaceRepository: IWorkspacesRepository,
    private readonly itemsRepository: IItemsRepository
  ) {}

  public async execute(data: Item) {
    const workspace = await this.workspaceRepository.findById(data.workspaceId)

    if (!workspace) {
      throw new WorkspaceNotFound(data.workspaceId)
    }

    let item = await this.itemsRepository.findByPath(workspace, data.path)

    if (item) {
      throw new ItemAlreadyExists(data.path)
    }

    item = new Item(data)

    return this.itemsRepository.create(workspace, item)
  }
}
