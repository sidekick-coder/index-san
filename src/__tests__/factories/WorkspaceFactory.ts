import { v4 as uuid } from 'uuid'
import Workspace from 'Entities/Workspace'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

export default class WorkspaceFactory {
  constructor(private workspaceRepository: IWorkspacesRepository) {}

  public async create(data?: Partial<Workspace>): Promise<Workspace> {
    const path = uuid()

    const workspace = new Workspace({
      displayName: 'Test-workspace_' + path,
      name: path,
      path,
      ...data,
    })

    return await this.workspaceRepository.create(workspace)
  }
}
