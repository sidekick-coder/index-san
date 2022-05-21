import { v4 as uuid } from 'uuid'
import Config from 'Entities/Config'
import IConfigsRepository from 'Repositories/IConfigsRepository'
import Workspace from 'Entities/Workspace'

export default class ConfigFactory {
  constructor(private configRepository: IConfigsRepository) {}

  public async create(workspace: Workspace, data?: Partial<Config>): Promise<Config> {
    const config = new Config({
      name: uuid(),
      value: {},
      workspaceId: workspace.id,
      ...data,
    })

    return this.configRepository.create(workspace, config)
  }

  public async createMany(
    workspace: Workspace,
    data?: Partial<Config>,
    count = 5
  ): Promise<Config[]> {
    const configs = []

    for (let i = 0; i < count; i++) {
      const config = await this.create(workspace, data)

      configs.push(config)
    }

    return configs
  }
}
