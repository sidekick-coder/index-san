import Item from 'Entities/Item'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IItemsRepository, { Filters } from 'Repositories/IItemsRepository'
import IMetadataRepository from 'Repositories/IMetadataRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import InMemoryMetadataRepository from 'Repositories/implementations/InMemoryMetadataRepository'
import InMemoryWorkspacesRepository from 'TestRepositories/InMemoryWorkspacesRepository'

export default class InMemoryItemsRepository implements IItemsRepository {
  public items: Item[] = []

  constructor(
    public readonly _workspacesRepository: IWorkspacesRepository = new InMemoryWorkspacesRepository(),
    public readonly _metasRepository: IMetadataRepository = new InMemoryMetadataRepository()
  ) {}

  public async index(filters: Filters) {
    return this.items
  }

  public async findOne(filters: Filters) {
    const [item] = await this.index(filters)

    return item || null
  }

  public async create(item: Item) {
    const workspace = await this._workspacesRepository.findById(item.workspaceId)

    if (!workspace) throw new WorkspaceNotFound(item.workspaceId)

    this.items.push(item)

    return item
  }
}
