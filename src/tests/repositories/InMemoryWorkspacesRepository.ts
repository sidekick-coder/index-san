import Workspace from 'Entities/Workspace'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

export default class InMemoryWorkspacesRepository implements IWorkspacesRepository {
  public workspaces: Workspace[] = []

  public async index() {
    return this.workspaces
  }

  public async findById(id: string) {
    const workspace = this.workspaces.find((workspace) => workspace.id === id)

    return workspace || null
  }

  public async create(data: Workspace) {
    const workspace = new Workspace(data)

    this.workspaces.push(workspace)

    return workspace
  }

  public async destroy(id: string) {
    this.workspaces = this.workspaces.filter((workspace) => workspace.id !== id)
  }
}
