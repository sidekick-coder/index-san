import lodash from 'lodash'
import Item from 'Entities/Item'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IItemsRepository, { Filters } from 'Repositories/IItemsRepository'
import IMetadataRepository from 'Repositories/IMetadataRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import InMemoryMetadataRepository from 'Repositories/implementations/InMemoryMetadataRepository'
import InMemoryWorkspacesRepository from 'Repositories/implementations/InMemoryWorkspacesRepository'

export default class InMemoryItemsRepository implements IItemsRepository {
  public items: Item[] = []

  constructor(
    public readonly _workspacesRepository: IWorkspacesRepository = new InMemoryWorkspacesRepository(),
    public readonly _metasRepository: IMetadataRepository = new InMemoryMetadataRepository()
  ) {}

  public async index(filters: Filters) {
    const { parentId, ...where } = filters?.where ?? {}

    const metas = await this._metasRepository.index()

    return lodash(this.items)
      .map((i) => i.merge(metas.find((m) => m.itemId === i.id)))
      .filter(where)
      .filter((i) => !parentId || i.id.startsWith(parentId))
      .value()
  }

  public async findOne(filters: Filters) {
    const [item] = await this.index(filters)

    return item || null
  }

  public async create(data: Omit<Item, 'merge'>) {
    const workspace = await this._workspacesRepository.findById(data.workspaceId)

    if (!workspace) throw new WorkspaceNotFound()

    const item = new Item(data)

    this.items.push(item)

    return item
  }
}
