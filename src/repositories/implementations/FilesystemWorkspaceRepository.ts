import { Query } from '@code-pieces/db-json'
import Workspace from 'Entities/Workspace'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

export default class FileSystemWorkspaceRepository implements IWorkspacesRepository {
  constructor(private readonly filename: string) {}

  public query() {
    return Query.from(this.filename)
  }

  public async index() {
    const workspaces = await this.query()

    return workspaces
  }

  public async create(data: Workspace) {
    await this.query().insert(data)

    return data
  }
}
