import Item from 'Entities/Item'
import { MetaRelation } from 'Entities/Metadata'
import Workspace from 'Entities/Workspace'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import IItemsRepository, { IndexFilters } from 'Repositories/IItemsRepository'
import IMetadataRepository from 'Repositories/IMetadataRepository'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'

interface Args {
  workspaceId: string
  filters?: IndexFilters
  relations?: string[] // relations to load
}

export default class ListItems {
  constructor(
    private workspacesRepository: IWorkspacesRepository,
    private itemsRepository: IItemsRepository,
    private metadataRepository: IMetadataRepository
  ) {}

  public async loadMetas(workspace: Workspace, item: Item) {
    const metas = await this.metadataRepository.index(workspace, { paths: [item.path] })

    if (!metas[item.path]) return

    item.metas = metas[item.path]
  }

  public async loadBelongsTo(workspace: Workspace, where: MetaRelation['where']) {
    if (!where?.path) return null

    return await this.itemsRepository.findByPath(workspace, where.path)
  }

  public async loadHasMany(workspace: Workspace, where: MetaRelation['where']) {
    if (!where?.parent_path) return []

    const { parent_path, ...filters } = where

    const items = await this.itemsRepository.index(workspace, {
      parentPath: parent_path,
    })

    for (const item of items) {
      await this.loadMetas(workspace, item)
    }

    return items.filter((item) =>
      Object.keys(filters).every((key) => item.metas && item.metas[key] === where[key])
    )
  }

  public async loadRelations(workspace: Workspace, item: Item, relations: string[]) {
    for (const relation of relations) {
      const relationItem = item.metas?.relations?.find((r) => r.name === relation)

      if (!relationItem) continue

      if (relationItem.type === 'belongs-to') {
        item[relationItem.name] = await this.loadBelongsTo(workspace, relationItem.where)
      }

      if (relationItem.type === 'has-many') {
        item[relationItem.name] = await this.loadHasMany(workspace, relationItem.where)
      }
    }
  }

  public async execute({ workspaceId, filters, relations }: Args) {
    const workspace = await this.workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound(workspaceId)

    const items = await this.itemsRepository.index(workspace, filters)

    for (const item of items) {
      await this.loadMetas(workspace, item)
      await this.loadRelations(workspace, item, relations || [])
    }

    return items
  }
}
