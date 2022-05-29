import Metadata from 'Entities/Metadata'
import fg from 'fast-glob'
import path, { basename, resolve } from 'path'
import { readFile, writeFile } from 'fs/promises'
import YAML from 'yaml'

import { pathToArray } from 'Utils/paths'

import IMetadataRepository, { IndexFilters } from 'Repositories/IMetadataRepository'
import Workspace from 'Entities/Workspace'
import Item from 'Entities/Item'
import { mkdirIfNotExist } from 'Utils/filesystem'

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

      metas.set(itemPath, YAML.parse(text))
    }

    return Object.fromEntries(metas)
  }

  public async save(workspace: Workspace, item: Item, metadata: Metadata) {
    const systemFilename = resolve(workspace.path, pathToArray(item.path).join('/'))

    const metaFilename = item.type === 'folder' ? '_root_.yml' : `${basename(systemFilename)}.yml`
    const metaFolder = item.type === 'folder' ? systemFilename : path.dirname(systemFilename)

    const metaPath = resolve(metaFolder, '.metas', metaFilename)

    const metaText = YAML.stringify({
      ...item.metas,
      ...metadata,
    })

    await mkdirIfNotExist(path.dirname(metaPath))

    await writeFile(metaPath, metaText)

    return {
      ...item.metas,
      ...metadata,
    }
  }
}
