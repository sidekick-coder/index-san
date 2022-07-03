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

  constructor(public readonly drive: IDrive = new InMemoryDrive()) {}

  public async index(filters: Filters) {
    const { parentId, ...where } = filters?.where ?? {}

    return lodash(this.items)
      .filter(where)
      .filter((i) => !parentId || i.id.startsWith(parentId))
      .value()
  }

  public async find(id: string) {
    const item = this.items.find((i) => i.id === id)

    return item || null
  }

  public async create(data: Item, buffer?: Buffer) {
    const item = new Item(data)

    this.items.push(item)

    if (item.type === 'file') {
      this.drive.put(item.filepath, buffer || Buffer.from(''))
    }

    return item
  }

  public async update(id: string, data: Item, buffer?: Buffer | undefined) {
    const index = this.items.findIndex((i) => i.id === id)

    const item = this.items.find((i) => i.id === id)

    if (!item) return

    item.name = data.name

    this.items[index] = item

    if (item.type === 'file' && buffer) {
      this.drive.put(item.filepath, buffer)
    }
  }

  public async delete(id: string): Promise<void> {
    const index = this.items.findIndex((i) => i.id === id)

    const item = this.items[index]

    if (!item) return

    this.items.splice(index, 1)

    if (item.type === 'file') {
      await this.drive.delete(item.filepath)
    }
  }
}
