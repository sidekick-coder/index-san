import { readdir, stat } from 'fs/promises'
import { basename, resolve } from 'path'
import { ISEventContext } from '../../lib/ISEventContext'

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

    const rawFiles = await readdir(path)

    const files = rawFiles.map((file) => ({
      name: basename(file),
      path: resolve(path, file),
    }))

    return {
      name: basename(path),
      files,
    }
  }
}
