import lodash from 'lodash'
import Item from 'Entities/Item'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IItemsRepository, { Filters } from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import InMemoryWorkspacesRepository from 'Repositories/implementations/InMemoryWorkspacesRepository'
import IDrive from 'Providers/IDrive'
import InMemoryDrive from 'Providers/implementations/InMemoryDrive'

export default class InMemoryItemsRepository implements IItemsRepository {
  public items: Item[] = []

  constructor(
    public readonly workspacesRepository: IWorkspacesRepository = new InMemoryWorkspacesRepository(),
    public readonly drive: IDrive = new InMemoryDrive()
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

  public async create(data: Item, buffer?: Buffer) {
    const workspace = await this.workspacesRepository.findById(data.workspaceId)

    if (!workspace) throw new WorkspaceNotFound()

    const item = new Item(data)

    this.items.push(item)

    if (item.type === 'file') {
      this.drive.put(item, buffer || Buffer.from(''))
    }

    return item
  }

  public async update(data: Item, buffer?: Buffer | undefined) {
    const index = this.items.findIndex(
      (i) => i.id === data.id && i.workspaceId === data.workspaceId
    )

    const item = this.items.find((i) => i.id === data.id && i.workspaceId === data.workspaceId)

    if (!item) return

    item.name = data.name

    this.items[index] = item

    if (item.type === 'file' && buffer) {
      this.drive.put(item, buffer)
    }
  }

  public async delete(item: Item): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id === item.id && item.workspaceId === i.workspaceId
    )

    if (index == -1) return

    this.items.splice(index, 1)

    if (item.type === 'file') {
      await this.drive.delete(item)
    }
  }
}
