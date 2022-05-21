import Workspace from 'Entities/Workspace'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

export default class InMemoryWorkspaceRepository implements IWorkspacesRepository {
  public workspaces: Workspace[] = []

  public async create(data: Workspace) {
    const workspace = new Workspace(data)

    this.workspaces.push(workspace)

    return workspace
  }

  public async index() {
    return this.workspaces
  }
}
