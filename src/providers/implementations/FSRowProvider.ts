import { Query } from '@code-pieces/db-json'
import DatabaseTable from 'Entities/DatabaseTable'
import fg from 'fast-glob'
import { resolve } from 'path'
import IDrive from 'Providers/IDrive'
import IRowProvider from 'Providers/IRowProvider'
import { writeFileIfNotExist } from 'Utils/filesystem'
import { pathToArray } from 'Utils/paths'
import FSDrive from './FSDrive'

interface Meta {
  name: string
  value: string
}

export default class FSRowProvider implements IRowProvider {
  private table: DatabaseTable
  constructor(private drive: IDrive) {}

  public use(table: DatabaseTable) {
    this.table = table
    return this
  }

  public async metas() {
    const filepath = resolve(this.table.id, '.index-san', 'metas.json')

    writeFileIfNotExist(filepath, '[]')

    return Query.from<Meta[]>(filepath)
  }

  public async index() {
    const filepath = pathToArray(this.table.id).join('/') + '/**'

    const folders = await fg(filepath, { dot: true, onlyDirectories: true, deep: 1 })
    const files = await fg(filepath, { dot: true, onlyFiles: true, deep: 1 })

    const metas = await this.metas()

    const items = folders
      .concat(files)
      .filter((item) => !item.includes('.index-san'))
      .map((filename) => {
        const metaName = pathToArray(filename)
          .slice(pathToArray(filepath).length - 1)
          .join('/')

        const meta = metas.find((m) => m.name === metaName)

        return {
          id: filename,
          basename: pathToArray(filename).pop(),
          ...(meta ? { meta } : {}),
        }
      })

    return items
  }
}
