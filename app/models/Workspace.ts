import { Query } from '@code-pieces/db-json'
import { app } from 'electron'
import { resolve, basename } from 'path'

const filename = resolve(app.getPath('userData'), 'workspaces.json')

export default class Workspace {
  public name: string
  public path: string

  public static query() {
    return Query.from(filename)
  }

  public static async find(path: string) {
    const data = await Workspace.query().findBy('path', path)

    if (!data) return null

    return Object.assign(new Workspace(), data)
  }

  public static async all() {
    const all = await Workspace.query()

    return all.map((data) => Object.assign(new Workspace(), data))
  }

  public static async create(path: string) {
    const all = await Workspace.all()

    if (all.some((w) => w.path === path)) {
      return
    }

    return Workspace.query().insert({
      path,
      name: basename(path),
    })
  }

  public async destroy() {
    return Workspace.query().where('path', this.path).delete()
  }
}
