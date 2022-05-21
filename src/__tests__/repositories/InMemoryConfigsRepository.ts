import Config from 'Entities/Config'
import Workspace from 'Entities/Workspace'
import IConfigsRepository, { IndexFilters } from 'Repositories/IConfigsRepository'

export default class InMemoryConfigsRepository implements IConfigsRepository {
  public configs: Config[] = []
  public async index(workspace: Workspace, filters?: IndexFilters): Promise<Config[]> {
    const configs = this.configs.filter((config) => config.workspaceId === workspace.id)

    if (!filters?.names) {
      return configs
    }

    return configs.filter((config) => filters?.names?.includes(config.name))
  }

  public async findByName(workspace: Workspace, name: string): Promise<Config | null> {
    const config = this.configs.find(
      (config) => config.workspaceId === workspace.id && config.name === name
    )

    return config || null
  }

  public async create(workspace: Workspace, data: Omit<Config, 'workspaceId'>): Promise<Config> {
    const config = new Config({
      ...data,
      workspaceId: workspace.id,
    })

    this.configs.push(config)

    return config
  }
}
