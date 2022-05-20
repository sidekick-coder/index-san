import { Query } from '@code-pieces/db-json'
import { basename, resolve } from 'path'
import { container } from 'tsyringe'
import IndexSan from '../../app'

export default class Workspace {
  public name: string
  public path: string

  public static query() {
    const app = container.resolve(IndexSan)

    const filename = app.userDataPath('workspaces.json')

    return Query.from<Workspace[]>(filename)
  }

  public static async find(name: string) {
    const [data] = await Workspace.query().where('name', name)

    if (!data) return null

    return Object.assign(new Workspace(), data) as Workspace
  }

  public static async findOrFail(name: string) {
    const data = await this.find(name)

    if (!data) throw new Error('Workspace not found')

    return data
  }

  public static async all(): Promise<Workspace[]> {
    const all = await Workspace.query()

    return all.map((data) => Object.assign(new Workspace(), data))
  }

  public static async create(path: string) {
    const all = await Workspace.all()
    const search = all.find((w) => w.path === path)

    if (search) {
      return search
    }

    await Workspace.query().insert({
      path,
      name: basename(path),
    })

    const workspace = new Workspace()

    workspace.name = basename(path)
    workspace.path = path

    return workspace
  }

  public async destroy() {
    return Workspace.query().where('path', this.path).delete()
  }

  public systemResolve(...args: string[]) {
    return resolve(this.path, ...this.normalizePath(...args))
  }

  public normalizePath(...args: string[]) {
    return args
      .map((p) => p.split('/'))
      .flat()
      .filter((p) => !!p)
  }

  public resolve(...args: string[]) {
    return this.normalizePath(...args).join('/')
  }
}
