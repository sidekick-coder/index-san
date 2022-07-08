import { Query } from '@code-pieces/db-json'
import Workspace from 'Entities/Workspace'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import { pathToArray } from 'Utils/paths'

export default class FSWorkspacesRepository implements IWorkspacesRepository {
  constructor(private readonly filename: string) {}

  public query() {
    return Query.from<Workspace[]>(this.filename)
  }

  public async index() {
    const workspaces = await this.query()

    return workspaces
  }

  public async findById(id: string) {
    const [workspace] = await this.query().where('id', id)

    return workspace ?? null
  }

  public async create(data: Workspace) {
    data.path = pathToArray(data.path).join('/')

    await this.query().insert(data)

    return data
  }

  public async destroy(id: string) {
    await this.query().where('id', id).delete()
  }
}
