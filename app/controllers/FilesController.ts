import { inject, injectable } from 'tsyringe'

import IndexSan from 'IndexSan'

import { cp, readFile, stat, writeFile } from 'fs/promises'
import { exists } from 'Helpers/filesystem'
import { ISEventContext } from 'Lib/ISEventContext'
@injectable()
export default class FilesController {
  constructor(@inject(IndexSan) public app: IndexSan) {}

  public async read({ data }: ISEventContext) {
    const { path } = data

    const exist = await exists(path)

    if (!exist) {
      return {
        status: 404,
        message: 'File not found',
      }
    }

    return readFile(path, 'utf8')
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

  public async pick({ data }: ISEventContext) {
    const { filters, properties } = data

    const { filePaths } = await this.app.electron.dialog.showOpenDialog({
      properties,
      filters,
    })

    return filePaths
  }

  public async copy({ data }: ISEventContext) {
    const { source, target } = data

    const sourceExists = await exists(source)
    const targetExists = await exists(target)

    if (!sourceExists) {
      throw new Error('Source file not found')
    }

    if (targetExists) {
      throw new Error('Target file already exist')
    }

    await cp(source, target)

    return true
  }
}
