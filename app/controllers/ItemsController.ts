import Item from 'App/models/Item'
import { stat, mkdir, writeFile, rmdir } from 'fs/promises'
import { resolve } from 'path'
import { ISEventContext } from '../../lib/ISEventContext'

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

  public async showSubitems({ data }: ISEventContext) {
    const item = await Item.findOrFail(data.workspace, data.path)

    return item.subitems()
  }

  public async showFiles({ data }: ISEventContext) {
    const item = await Item.findOrFail(data.workspace, data.path)

    return item.files()
  }

  public async showOption(ctx: ISEventContext) {
    const { workspaceName, itemPath, name } = ctx.data

    const item = await Item.findOrFail(workspaceName, itemPath)

    return item.findOption(name)
  }

  public async updateOption(ctx: ISEventContext) {
    const { workspaceName, itemPath, name, data } = ctx.data

    const item = await Item.findOrFail(workspaceName, itemPath)

    return item.updateOption(name, data)
  }
}
