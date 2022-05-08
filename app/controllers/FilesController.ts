import { readdir, stat } from 'fs/promises'
import { basename, extname, resolve } from 'path'
import { EventContext } from '../../contracts/event-context'

export default class FilesController {
  public async metadata({ data }: EventContext) {
    const { path } = data

    const stats = await stat(path)

    return {
      name: basename(path),
      size: stats.size,
      path: path,
      extension: extname(path),
      isDirectory: stats.isDirectory(),
    }
  }

  public async listFolder({ data }: EventContext) {
    const { path } = data

    const exists = await stat(path)
      .then((d) => d.isDirectory())
      .catch(() => false)

    if (!exists) {
      return {
        status: 404,
        message: 'Not a directory',
      }
    }

    const files = await readdir(path, { withFileTypes: true })

    return files.map((file) => ({
      name: basename(file.name),
      path: resolve(path, file.name),
      isDirectory: file.isDirectory(),
      extension: extname(path),
    }))
  }
}
