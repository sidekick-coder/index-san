import fs from 'fs/promises'
import { basename, resolve } from 'path'

import { pathToArray } from 'Utils/paths'

import Item from 'Entities/Item'
import Workspace from 'Entities/Workspace'
import IItemsRepository from 'Repositories/IItemsRepository'

export default class FsItemsRepository implements IItemsRepository {
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
      displayName: basename(folderName),
    })
  }

  public async create(workspace: Workspace, item: Item) {
    const folderPath = resolve(workspace.path, item.path)

    await fs.mkdir(folderPath, { recursive: true })

    return item
  }
}
