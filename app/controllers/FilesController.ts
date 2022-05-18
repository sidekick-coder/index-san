import File from 'App/models/File'
import Workspace from 'App/models/Workspace'
import { readdir, readFile, stat, writeFile } from 'fs/promises'
import { exists } from 'Helpers/filesystem'
import { basename, extname, resolve } from 'path'
import { ISEventContext } from '../../lib/ISEventContext'

export default class FilesController {
  public async read({ data }: ISEventContext) {
    const workspace = await Workspace.findOrFail(data.workspace)

    const filename = workspace.systemResolve(data.path)

    const exist = await exists(filename)

    if (!exist) {
      return {
        status: 404,
        message: 'File not found',
      }
    }

    return readFile(filename, 'utf8')
  }

  public async write({ data }: ISEventContext) {
    const { path, content } = data

    const exists = await stat(path)
      .then((d) => d.isFile())
      .catch(() => false)

    if (!exists) {
      return {
        status: 404,
        message: 'File not found',
      }
    }

    return writeFile(path, content, 'utf8')
  }

  public async listFolder({ data }: ISEventContext) {
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
