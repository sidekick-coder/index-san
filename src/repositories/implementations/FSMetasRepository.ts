import Metadata from 'Entities/Metadata'
import fg from 'fast-glob'
import path, { basename, resolve } from 'path'
import fs from 'fs/promises'
import YAML from 'yaml'

import { pathToArray } from 'Utils/paths'

import IMetadataRepository, { Filters } from 'Repositories/IMetadataRepository'
import Workspace from 'Entities/Workspace'
import Item from 'Entities/Item'
import { exists, mkdirIfNotExist, readFileIfExist, writeFileIfNotExist } from 'Utils/filesystem'
import IWorkspacesRepository from 'Repositories/IWorkspacesRepository'
import WorkspaceNotFound from 'Errors/WorkspaceNotFound'
import ItemNotFound from 'Errors/ItemNotFound'

export default class FSMetadataRepository implements IMetadataRepository {
  constructor(public readonly _workspacesRepository: IWorkspacesRepository) {}

  public async index(filters?: Filters) {
    const workspaceId = filters?.where?.workspaceId

    if (!workspaceId) throw new WorkspaceNotFound()

    const workspace = await this._workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound()

    const filenames: string[] = []
    const metas: Metadata[] = []

    const pattern = pathToArray(workspace.path).join('/') + '/**/*.yml'

    filenames.push(...(await fg(pattern, { dot: true })))

    filenames.sort((a, b) => a[1].length - b[1].length)

    for (const filename of filenames) {
      const itemId = pathToArray(filename.replace(path.extname(filename), ''))
        .slice(pathToArray(workspace.path).length)
        .filter((p) => !['.metas', '_root_'].includes(p))
        .filter((p) => !['.metas', '_root_'].includes(p))
        .join('/')

      if (filters?.where.itemId && !filters.where.itemId.includes(itemId)) continue

      const content = await readFileIfExist(filename)

      metas.push({
        ...YAML.parse(content.toString()),
        itemId,
      })
    }

    return metas
  }

  public async create(metadata: Metadata): Promise<Metadata> {
    const { workspaceId, itemId, ...data } = metadata

    const workspace = await this._workspacesRepository.findById(workspaceId)

    if (!workspace) throw new WorkspaceNotFound()

    const itemFilename = path.resolve(workspace.path, ...pathToArray(itemId))

    const itemExist = await exists(itemFilename)

    if (!itemExist) throw new ItemNotFound()

    const stat = await fs.stat(itemFilename)

    const metaFolder = stat.isFile() ? path.dirname(itemFilename) : itemFilename
    const metaFilename = stat.isFile() ? `${basename(itemFilename)}.yml` : '_root_.yml'

    const metaPath = resolve(metaFolder, '.metas', metaFilename)

    await writeFileIfNotExist(metaPath, YAML.stringify(data))

    return metadata
  }

  public async findOne(filters?: Filters) {
    const metas = await this.index(filters)

    return metas[0] || null
  }
}
