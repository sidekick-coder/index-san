import Workspace from 'Entities/Workspace'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import { v4 as uuid } from 'uuid'

export default class CreateWorkspace {
  constructor(private workspaceRepository: IWorkspacesRepository) {}

  public async execute(data: Omit<Workspace, 'id'>) {
    const workspace = new Workspace(data, uuid())

    await this.workspaceRepository.create(workspace)

    return workspace
  }
}
