import Item from 'Entities/Item'
import ItemNotFound from 'Errors/ItemNotFound'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IItemsRepository from 'Repositories/IItemsRepository'

interface Args {
  workspaceId: string
  id: string
}

export default class ShowItem {
  constructor(private repository: IItemsRepository) {}

  public async execute({ workspaceId, id }: Args): Promise<Item> {
    const workspace = await this.repository._workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound()

    const item = await this.repository.findOne({
      where: {
        workspaceId,
        id,
      },
    })

    if (!item) throw new ItemNotFound()

    return item
  }
}
