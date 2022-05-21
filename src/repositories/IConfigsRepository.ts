import Config from 'Entities/Config'
import Workspace from 'Entities/Workspace'

export interface IndexFilters {
  names?: string[]
}
export default interface IConfigsRepository {
  index(workspace: Workspace, filters?: IndexFilters): Promise<Config[]>
  create(workspace: Workspace, config: Omit<Config, 'workspaceId'>): Promise<Config>
}
