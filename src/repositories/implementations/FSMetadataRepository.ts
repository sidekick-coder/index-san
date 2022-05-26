import Metadata from 'Entities/Metadata'
import fg from 'fast-glob'
import path from 'path'
import { readFile } from 'fs/promises'
import { parse } from 'yaml'

import { pathToArray } from 'Utils/paths'

import IMetadataRepository, { IndexFilters } from 'Repositories/IMetadataRepository'
import Workspace from 'Entities/Workspace'

export default class FSMetadataRepository implements IMetadataRepository {
  public async index(workspace: Workspace, filters?: IndexFilters) {
    const root = pathToArray(workspace.path).join('/')

    const patter = root + '/**/.metas/*.yml'

    const list = await fg(patter, { dot: true })

    const metas = new Map<string, Metadata>()

    for (const file of list) {
      const itemPath = pathToArray(file.replace(root, ''))
        .filter((p) => p !== '.metas')
        .filter((p) => p !== '_root_.yml')
        .join('/')
        .replace(/\.yml$/, '')

      if (filters && !filters.paths?.includes(itemPath)) {
        continue
      }

      const systemPath = file.replace(/\//g, path.sep)

      const text = await readFile(systemPath, 'utf8')

      metas.set(itemPath, parse(text))
    }

    return Object.fromEntries(metas)
  }
}
