import lodash from 'lodash'
import { dirname, resolve } from 'path'

import { pathToArray } from 'Utils/paths'
import { readdirIfExist } from 'Utils/filesystem'
import Item from 'Entities/Item'
import IItemsRepository, { Filters } from 'Repositories/IItemsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'

export default class FsItemsRepository implements IItemsRepository {
  constructor(public readonly _workspacesRepository: IWorkspacesRepository) {}

  public async index(filters?: Filters) {
    const { parentId, workspaceId, id, ...where } = filters?.where ?? {}

    if (!workspaceId) throw new WorkspaceNotFound()

    const workspace = await this._workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound()

    const items: Item[] = []

    let filepath = workspace.path

    if (parentId) {
      filepath = resolve(workspace.path, ...pathToArray(parentId))
    }

    if (id) {
      filepath = resolve(workspace.path, ...pathToArray(dirname(id)))
    }

    const files = await readdirIfExist(filepath)

    files
      .filter((file) => !file.name.includes('.metas'))
      .forEach((file) =>
        items.push(
          new Item({
            id: pathToArray(filepath, file.name)
              .slice(pathToArray(workspace.path).length)
              .join('/'),
            workspaceId: workspace.id,
            parentId,
            name: file.name,
            type: file.isFile() ? 'file' : 'folder',
          })
        )
      )

    return lodash(items)
      .filter(where)
      .filter((i) => !id || i.id === id)
      .value()
  }

  public async findOne(filters?: Filters) {
    const items = await this.index(filters)

    return items[0] ?? null
  }

  public async create(item: Item) {
    return item
  }
}
