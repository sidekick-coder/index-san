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

  public async execute(data: Omit<Item, 'merge'>) {
    const workspace = await this.workspaceRepository.findById(data.workspaceId)

    if (!workspace) {
      throw new WorkspaceNotFound()
    }

    let item = await this.itemsRepository.findOne({
      where: {
        workspaceId: data.workspaceId,
        id: data.id,
      },
    })

    if (item) {
      throw new ItemAlreadyExists()
    }

    item = new Item(data)

    return this.itemsRepository.create(item)
  }
}
