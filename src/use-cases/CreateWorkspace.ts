import Workspace from 'Entities/Workspace'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

type CreateWorkspaceData = Omit<Workspace, 'id'>
export default class CreateWorkspace {
  constructor(private workspaceRepository: IWorkspacesRepository) {}

  public async execute(data: CreateWorkspaceData) {
    const workspace = new Workspace(data)

    await this.workspaceRepository.create(workspace)

    return workspace
  }
}
