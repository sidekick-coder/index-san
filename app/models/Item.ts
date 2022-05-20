import { Query } from '@code-pieces/db-json'
import { mkdir, readdir, writeFile } from 'fs/promises'
import { exists, writeFileIfNotExist } from 'Helpers/filesystem'
import { basename, resolve } from 'path'
import File from './File'
import Option from './Option'
import Workspace from './Workspace'

export default class Item {
  public name: string
  public path: string
  public systemPath: string

  public workspace: Workspace

  public static make(data: Partial<Item>) {
    const item = new Item()

    Object.assign(item, data)

    item.systemPath = item.workspace.systemResolve(item.path)

    return item
  }

  public resolve(...args: string[]) {
    return this.workspace.resolve(this.path, ...args)
  }

  public systemResolve(...args: string[]) {
    return this.workspace.systemResolve(this.systemPath, ...args)
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
    })
  }

  public static async find(workspaceName: string, itemPath: string) {
    const workspace = await Workspace.findOrFail(workspaceName)

    const filepath = resolve(workspace.path, ...itemPath.split('/'))

    const exist = exists(filepath)

    if (!exist) {
      return null
    }

    const isWorkspace = itemPath === '/'

    return this.make({
      name: isWorkspace ? workspace.name : basename(filepath),
      path: isWorkspace ? '/' : workspace.resolve(itemPath),
      workspace: workspace,
    })
  }

  public static async findOrFail(workspaceName: string, itemPath: string) {
    const item = await this.find(workspaceName, itemPath)

    if (!item) {
      throw new Error('Item not found')
    }

    return item
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
    const options = await this.findOptions()

    console.log(options.find((o) => o.name === 'index.md'))

    return raw
      .filter((f) => f.isFile())
      .map((f) =>
        File.make({
          name: f.name,
          displayName: options.find((o) => o.name === f.name)?.value?.displayTitle,
          path: this.resolve(f.name),
          workspace: this.workspace,
          item: this,
        })
      )
  }

  public async findOptions() {
    const optionsFilePath = this.systemResolve('.index-san', 'options.json')

    await writeFileIfNotExist(optionsFilePath, JSON.stringify([]))

    return Option.from<any>(optionsFilePath).all()
  }
}
