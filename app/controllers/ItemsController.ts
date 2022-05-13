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
    const { path } = data

    const isDir = await stat(path)
      .then((stats) => stats.isDirectory())
      .catch(() => false)

    if (!isDir) {
      return {
        status: 404,
        message: 'Not a directory',
      }
    }

    const index = resolve(path, 'index.md')
    const haveIndex = await exists(index)
    const rawFiles = await readdir(path, { withFileTypes: true })

    const files = rawFiles.map((file) => ({
      name: basename(file.name),
      path: resolve(path, file.name),
      isFolder: file.isDirectory(),
    }))

    return {
      name: basename(path),
      index: haveIndex ? index : null,
      files,
    }
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
}
