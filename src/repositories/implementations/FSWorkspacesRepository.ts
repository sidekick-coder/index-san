import { Query } from '@code-pieces/db-json'
import Workspace from 'Entities/Workspace'
import { resolve } from 'path'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import { writeFileIfNotExist } from 'Utils/filesystem'

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
    await this.query().insert(data)

    const filename = resolve(data.path, '.index-san', 'configs.json')

    await writeFileIfNotExist(filename, JSON.stringify([]))

    return data
  }

  public async destroy(id: string) {
    await this.query().where('id', id).delete()
  }
}
