import Workspace from 'Entities/Workspace'
import IWorkspaceRepository from 'Repositories/IWorkspaceRepository'

export default class InMemoryWorkspaceRepository implements IWorkspaceRepository {
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
