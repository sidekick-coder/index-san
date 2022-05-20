import Workspace from 'Entities/Workspace'
import IWorkspaceRepository from 'Repositories/IWorkspaceRepository'
import { v4 as uuid } from 'uuid'

export default class CreateWorkspace {
  constructor(private workspaceRepository: IWorkspaceRepository) {}

  public async execute(data: Omit<Workspace, 'id'>) {
    const workspace = new Workspace(data, uuid())

    await this.workspaceRepository.create(workspace)

    return workspace
  }
}
