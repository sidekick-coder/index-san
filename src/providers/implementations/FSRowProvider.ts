import { Query } from '@code-pieces/db-json'
import DatabaseTable from 'Entities/DatabaseTable'
import fg from 'fast-glob'
import path, { resolve } from 'path'
import IRowProvider from 'Providers/IRowProvider'
import { exists, writeFileIfNotExist } from 'Utils/filesystem'
import { pathToArray } from 'Utils/paths'
import FSDrive from './FSDrive'

interface Meta {
  name: string
  value: Record<string, any>
}

export default class FSRowProvider implements IRowProvider {
  private table: DatabaseTable
  constructor(private drive: FSDrive) {}

  public use(table: DatabaseTable) {
    this.table = table
    return this
  }

  public metas() {
    const filepath = resolve(this.table.id, '.index-san', 'metas.json')

    writeFileIfNotExist(filepath, '[]')

    return Query.from<Meta[]>(filepath)
  }

  public async updateOrCreateMeta(id: string, data: any) {
    const metas = await this.metas()

    const meta = metas.find((meta) => meta.name === id)

    if (meta) {
      return await this.metas()
        .where('name', id)
        .update({
          name: id,
          value: {
            ...meta.value,
            ...data,
          },
        })
    }

    return await this.metas().insert({ name: id, value: data })
  }

  public exists(id: string) {
    const filepath = pathToArray(this.table.id, id).join(path.sep)

    return exists(filepath)
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
        const item = {
          id: pathToArray(filename).pop() as string,
        }

        const meta = metas.find((meta) => meta.name === item.id)

        if (meta) {
          Object.assign(item, meta.value)
        }

        return item
      })

    return items
  }

  public async update(id: string, data: any): Promise<any> {
    const exist = await this.exists(id)

    if (!exist) return

    await this.updateOrCreateMeta(id, data)
  }
}
