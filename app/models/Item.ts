import { mkdir, readdir, writeFile } from 'fs/promises'
import { exists } from 'Helpers/filesystem'
import { basename, resolve } from 'path'
import File from './File'
import Workspace from './Workspace'

export default class Item {
  public name: string
  public path: string
  public index: string | null

  public workspace: Workspace

  public get systemPath() {
    return resolve(this.workspace.path, ...this.path.split('/'))
  }

  public static make(data: Partial<Item>) {
    const item = new Item()

    Object.assign(item, data)

    return item
  }

  public static async create(workspaceName: string, path: string) {
    const workspace = await Workspace.findOrFail(workspaceName)

    const folder = workspace.systemResolve(path)
    const index = workspace.systemResolve(path, 'index.md')

    await mkdir(folder, { recursive: true })
    await writeFile(index, '# New item')

    return this.make({
      name: basename(folder),
      path: workspace.resolve(path),
      workspace: workspace,
      index: workspace.resolve(path, 'index.md'),
    })
  }

  public static async find(workspaceName: string, itemPath: string) {
    const workspace = await Workspace.findOrFail(workspaceName)

    const filepath = resolve(workspace.path, ...itemPath.split('/'))

    const exist = exists(filepath)

    if (!exist) {
      return null
    }

    const haveIndex = await exists(resolve(filepath, 'index.md'))

    const name = itemPath === '/' ? workspace.name : basename(filepath)

    return this.make({
      name: name,
      path: workspace.resolve(itemPath),
      workspace: workspace,
      index: haveIndex ? workspace.resolve(itemPath, 'index.md') : null,
    })
  }

  public static async findOrFail(workspaceName: string, itemPath: string) {
    const item = await this.find(workspaceName, itemPath)

    if (!item) {
      throw new Error('Item not found')
    }

    return item
  }

  public resolve(...args: string[]) {
    return this.workspace.resolve(this.path, ...args)
  }

  public async subitems() {
    const raw = await readdir(this.systemPath, { withFileTypes: true })

    return await Promise.all(
      raw
        .filter((f) => f.isDirectory())
        .map((f) => Item.find(this.workspace.name, `${this.path}/${f.name}`))
    )
  }

  public async files() {
    const raw = await readdir(this.systemPath, { withFileTypes: true })

    return await Promise.all(
      raw
        .filter((f) => !f.isDirectory())
        .map((f) => File.find(this.workspace.name, this.path, f.name))
    )
  }
}
