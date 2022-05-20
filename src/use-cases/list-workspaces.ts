import Workspace from 'Entities/Workspace'
import IWorkspaceRepository from 'Repositories/IWorkspaceRepository'

export default class ListWorkspaces {
  constructor(private workspaceRepository: IWorkspaceRepository) {}

  public async execute(): Promise<Workspace[]> {
    const workspaces = await this.workspaceRepository.index()

    return workspaces
  }
}
