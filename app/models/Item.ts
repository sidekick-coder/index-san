import { mkdir, readdir, writeFile } from 'fs/promises'
import { exists } from 'Helpers/filesystem'
import { basename, resolve } from 'path'
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

    const folder = resolve(workspace.path, ...path.split('/'))
    const index = resolve(folder, 'index.md')

    await mkdir(folder, { recursive: true })
    await writeFile(index, '# New item')

    return this.make({
      name: basename(folder),
      path,
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
      path: itemPath,
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

  public async files() {
    const all = await readdir(this.systemPath, { withFileTypes: true })

    const subitems = await Promise.all(
      all
        .filter((file) => file.isDirectory())
        .map(async (file) => {
          const haveIndex = await exists(resolve(this.systemPath, file.name, 'index.md'))
          const index = haveIndex ? this.workspace.resolve(this.path, file.name, 'index.md') : null

          return {
            name: file.name,
            path: this.workspace.resolve(this.path, file.name),
            workspace: this.workspace,
            index,
          }
        })
    )

    const files = all
      .filter((f) => !f.isDirectory())
      .map((file) => ({
        name: file.name,
        path: this.workspace.resolve(this.path, file.name),
        workspace: this.workspace,
      }))

    return [...subitems, ...files]
  }
}
