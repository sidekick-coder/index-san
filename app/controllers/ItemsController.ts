import Item from 'App/models/Item'
import { readdir, stat, mkdir, writeFile, rmdir } from 'fs/promises'
import { basename, resolve } from 'path'
import { ISEventContext } from '../../lib/ISEventContext'

const exists = (path: string) =>
  stat(path)
    .then(() => true)
    .catch(() => false)

const isDirectory = (path: string) =>
  stat(path)
    .then((stat) => stat.isDirectory())
    .catch(() => false)

export default class ItemsController {
  public async show({ data }: ISEventContext) {
    const { workspace, path } = data

    return await Item.find(workspace, path)
  }

  public async store({ data }: ISEventContext) {
    const { path, name } = data

    const isDir = await isDirectory(path)

    if (!isDir) {
      return {
        status: 501,
        message: 'Not a directory',
      }
    }

    const folder = resolve(path, name)
    const index = resolve(folder, 'index.md')

    await mkdir(folder, { recursive: true })
    await writeFile(index, '# New item')
  }

  public async destroy({ data }: ISEventContext) {
    const { path } = data

    const isDir = await isDirectory(path)

    if (!isDir) {
      return {
        status: 501,
        message: 'Not a directory',
      }
    }

    await rmdir(path, { recursive: true })
  }

  public async files({ data }: ISEventContext) {
    const item = await Item.findOrFail(data.workspace, data.path)

    return item.files()
  }
}
