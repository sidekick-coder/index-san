import fs from 'fs/promises'
import { basename, resolve } from 'path'

import { pathToArray } from 'Utils/paths'

import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'
import IItemsRepository, { IndexFilters } from 'Repositories/IItemsRepository'

export default class FsItemsRepository implements IItemsRepository {
  public async index(workspace: Workspace, filters?: IndexFilters): Promise<Item[]> {
    let folderPath = resolve(workspace.path)

    if (filters?.parentPath) {
      folderPath = resolve(workspace.path, ...pathToArray(filters.parentPath))
    }

    const result = await fs.readdir(folderPath, { withFileTypes: true })

    const items = result
      .filter((f) => f.name !== '.index-san')
      .map((f) => {
        const path = pathToArray(folderPath.replace(workspace.path, ''))
          .filter((p) => p !== '')
          .concat(f.name)
          .join('/')

        return new Item({
          path: path,
          workspaceId: workspace.id,
          name: f.name,
          type: f.isFile() ? 'file' : 'folder',
        })
      })

    return items
  }

  public async findByPath(workspace: Workspace, path: string) {
    const filename = resolve(workspace.path, ...pathToArray(path))

    const stats = await fs
      .stat(filename)
      .then((s) => s)
      .catch(() => null)

    if (!stats) return null

    return new Item({
      path,
      workspaceId: workspace.id,
      name: basename(filename),
      type: stats.isFile() ? 'file' : 'folder',
    })
  }

  public async create(workspace: Workspace, item: Item) {
    const folderPath = resolve(workspace.path, item.path)

    await fs.mkdir(folderPath, { recursive: true })

    return item
  }
}
