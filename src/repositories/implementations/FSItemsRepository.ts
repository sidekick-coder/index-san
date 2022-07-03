import path from 'path'
import lodash from 'lodash'
import { basename, dirname, resolve } from 'path'
import fg from 'fast-glob'

import { pathToArray } from 'Utils/paths'
import { readdirIfExist } from 'Utils/filesystem'
import Item from 'Entities/Item'
import IItemsRepository, { Filters } from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IDrive from 'Providers/IDrive'
import FSDrive from 'Providers/implementations/FSDrive'
import ItemNotFound from 'Errors/ItemNotFound'

export default class FsItemsRepository implements IItemsRepository {
  constructor(public readonly drive: FSDrive) {}

  public async index(filters?: Filters) {
    const { parentId } = filters?.where || {}

    if (!parentId) return []

    const items: Item[] = []

    const filepath = pathToArray(parentId).join('/') + '/**'

    const folders = await fg(filepath, { dot: true, onlyDirectories: true })
    const files = await fg(filepath, { dot: true, onlyFiles: true })

    files.concat(folders).map((filename) => {
      items.push(
        Item.mount({
          id: filename,
          filepath: filename,
          name: basename(filename),
          type: folders.includes(filename) ? 'folder' : 'file',
        })
      )
    })

    return items
  }

  public async find(id: string) {
    const filepath = fg.escapePath(id)

    const [item] = await this.index({
      where: {
        id,
        parentId: dirname(filepath),
      },
    })

    return item || null
  }

  public async create(data: Omit<Item, 'id'>, buffer?: Buffer) {
    if (data.type === 'folder') {
      await this.drive.mkDir(data.filepath)
    }

    if (data.type === 'file') {
      await this.drive.put(data.filepath, buffer || Buffer.from(''))
    }

    return Item.mount({
      id: data.filepath,
      filepath: data.filepath,
      name: basename(data.filepath),
      type: data.type,
    })
  }

  public async update(id: string, data: Partial<Item>, buffer?: Buffer | undefined) {
    const item = await this.find(id)

    if (!item) throw new ItemNotFound()

    if (item.type === 'file' && buffer) {
      await this.drive.put(item.filepath, buffer)
    }

    if (data.filepath) {
      await this.drive.move(item.filepath, data.filepath)
    }
  }

  public async delete(id: string) {
    const item = await this.find(id)

    if (!item) throw new ItemNotFound()

    await this.drive.delete(item.filepath)
  }
}
