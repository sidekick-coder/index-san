import lodash from 'lodash'
import Item from 'Entities/Item'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IItemsRepository, { Filters } from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import InMemoryWorkspacesRepository from 'Repositories/implementations/InMemoryWorkspacesRepository'

export default class InMemoryItemsRepository implements IItemsRepository {
  public items: Item[] = []

  constructor(
    public readonly workspacesRepository: IWorkspacesRepository = new InMemoryWorkspacesRepository()
  ) {}

  public async index(filters: Filters) {
    const { parentId, ...where } = filters?.where ?? {}

    return lodash(this.items)
      .filter(where)
      .filter((i) => !parentId || i.id.startsWith(parentId))
      .value()
  }

  public async findOne(filters: Filters) {
    const [item] = await this.index(filters)

    return item || null
  }

  public async create(data: Omit<Item, 'merge'>) {
    const workspace = await this.workspacesRepository.findById(data.workspaceId)

    if (!workspace) throw new WorkspaceNotFound()

    const item = new Item(data)

    this.items.push(item)

    return item
  }
}
