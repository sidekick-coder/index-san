import { Query } from '@code-pieces/db-json'
import { basename } from 'path'
import { container } from 'tsyringe'
import App from '../../app'

export default class Workspace {
  public name: string
  public path: string

  public static query() {
    const app = container.resolve(App)

    const filename = app.userDataPath('workspaces.json')

    return Query.from(filename)
  }

  public static async find(name: string) {
    const data = await Workspace.query().findBy('name', name)

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
}
