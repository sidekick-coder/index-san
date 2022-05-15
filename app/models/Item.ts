import { mkdir, writeFile } from 'fs/promises'
import { exists } from 'Helpers/filesystem'
import { basename, resolve } from 'path'
import Workspace from './Workspace'

export default class Item {
  public name: string
  public workspace: string
  public path: string
  public index: string | null

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
      path: folder,
      workspace: workspace.name,
      index,
    })
  }

  public static async find(workspaceName: string, itemPath: string) {
    const workspace = await Workspace.findOrFail(workspaceName)

    const filepath = resolve(workspace.path, itemPath)

    const exist = exists(filepath)

    if (!exist) {
      return null
    }

    const haveIndex = await exists(resolve(filepath, 'index.md'))

    return this.make({
      name: basename(filepath),
      path: filepath,
      workspace: workspace.name,
      index: haveIndex ? resolve(filepath, 'index.md') : null,
    })
  }
}
