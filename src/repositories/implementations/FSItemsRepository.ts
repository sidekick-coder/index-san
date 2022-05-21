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

    const folders = result.filter((r) => r.isDirectory())

    const items = folders
      .filter((f) => f.name !== '.index-san')
      .map((folder) => {
        const path = pathToArray(folderPath.replace(workspace.path, ''))
          .filter((p) => p !== '')
          .concat(folder.name)
          .join('/')

        return new Item({
          path: path,
          workspaceId: workspace.id,
          name: folder.name,
        })
      })

    return items
  }

  public async findByPath(workspace: Workspace, path: string) {
    const folderName = resolve(workspace.path, ...pathToArray(path))

    const isValid = await fs
      .stat(folderName)
      .then((stat) => stat.isDirectory())
      .catch(() => false)

    if (!isValid) return null

    return new Item({
      path,
      workspaceId: workspace.id,
      name: basename(folderName),
    })
  }

  public async create(workspace: Workspace, item: Item) {
    const folderPath = resolve(workspace.path, item.path)

    await fs.mkdir(folderPath, { recursive: true })

    return item
  }
}
