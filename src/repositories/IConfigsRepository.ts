import Config from 'Entities/Config'
import Workspace from 'Entities/Workspace'

export interface IndexFilters {
  names?: string[]
}
export default interface IConfigsRepository {
  index(workspace: Workspace, filters?: IndexFilters): Promise<Config[]>
  findByName(workspace: Workspace, name: string): Promise<Config | null>
  create(workspace: Workspace, config: Omit<Config, 'workspaceId'>): Promise<Config>
}
