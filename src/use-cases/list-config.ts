import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IConfigsRepository, { IndexFilters } from 'Repositories/IConfigsRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

export default class ListConfig {
  constructor(
    private workspaceRepository: IWorkspacesRepository,
    private repository: IConfigsRepository
  ) {}

  public async execute(workspaceId: string, filters?: IndexFilters): Promise<Record<string, any>> {
    const workspace = await this.workspaceRepository.findById(workspaceId)

    if (!workspace) {
      throw new WorkspaceNotFound(workspaceId)
    }

    const configs = await this.repository.index(workspace, filters)

    return configs
  }
}
