import { Query } from '@code-pieces/db-json'
import { resolve } from 'path'

import Config from 'Entities/Config'
import Workspace from 'Entities/Workspace'
import IConfigsRepository, { IndexFilters } from 'Repositories/IConfigsRepository'

export default class FSConfigsRepository implements IConfigsRepository {
  public query(workspace: Workspace) {
    const filename = resolve(workspace.path, '.index-san', 'configs.json')

    return Query.from<Config[]>(filename)
  }

  public async index(workspace: Workspace, filters?: IndexFilters) {
    const all = await this.query(workspace)

    const names = filters?.names ?? undefined

    if (!names) return all

    return all.filter(({ name }) => names.includes(name))
  }

  public async create(workspace: Workspace, data: Omit<Config, 'workspaceId'>): Promise<Config> {
    const config = new Config({
      ...data,
      workspaceId: workspace.id,
    })

    await this.query(workspace).insert(config)

    return config
  }
}
