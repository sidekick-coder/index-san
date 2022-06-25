import Workspace from 'Entities/Workspace'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

export default class ListWorkspaces {
  constructor(private workspaceRepository: IWorkspacesRepository) {}

  public async execute(): Promise<Workspace[]> {
    const workspaces = await this.workspaceRepository.index()

    return workspaces
  }
}
