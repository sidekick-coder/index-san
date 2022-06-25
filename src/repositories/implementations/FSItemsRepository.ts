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
  constructor(
    public readonly workspacesRepository: IWorkspacesRepository,
    public readonly drive: FSDrive
  ) {}

  public async index(filters?: Filters) {
    const { workspaceId, parentId } = filters?.where || {}

    if (!workspaceId) throw new Error('workspaceId required')

    const workspace = await this.workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound()

    const filepath = pathToArray(workspace.path, '**').join('/')

    const items: Item[] = []

    const folders = await fg(filepath, { dot: true, onlyDirectories: true })
    const files = await fg(filepath, { dot: true, onlyFiles: true })

    files
      .concat(folders)
      .filter((f) => {
        if (!parentId) return true

        const relativePath = pathToArray(f).slice(pathToArray(workspace.path).length).join('/')

        if (Array.isArray(parentId)) {
          return parentId.includes(dirname(relativePath))
        }

        return dirname(relativePath) === pathToArray(parentId).join('/')
      })
      .map((filename) => {
        const relativePath = pathToArray(filename)
          .slice(pathToArray(workspace.path).length)
          .join('/')

        items.push(
          Item.mount({
            id: `/${workspace.id}/${relativePath}`,
            filepath: relativePath,
            name: basename(filename),
            workspaceId: workspace.id,
            type: folders.includes(filename) ? 'folder' : 'file',
          })
        )
      })

    return items
  }

  public async find(id: string) {
    const [workspaceId, ...filepath] = pathToArray(id)

    const workspace = await this.workspacesRepository.findById(workspaceId)

    if (!workspace) return null

    this.drive.use(workspace.path)

    const stats = await this.drive.stat(filepath.join('/'))

    if (!stats) return null

    return Item.mount({
      id: id,
      filepath: filepath.join('/'),
      name: basename(filepath.join('/')),
      workspaceId: workspace.id,
      type: stats.isDirectory() ? 'folder' : 'file',
    })
  }

  public async create(data: Omit<Item, 'id'>, buffer?: Buffer) {
    const workspaceId = data.workspaceId

    const workspace = await this.workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound()

    this.drive.use(workspace.path)

    if (data.type === 'folder') {
      await this.drive.mkDir(data.filepath)
    }

    if (data.type === 'file') {
      await this.drive.put(data.filepath, buffer || Buffer.from(''))
    }

    return Item.mount({
      id: `/${workspace.id}/${data.filepath}`,
      filepath: data.filepath,
      name: basename(data.filepath),
      workspaceId: workspace.id,
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
