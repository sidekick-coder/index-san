import path from 'path'
import fs from 'fs/promises'

import IDrive from 'Providers/IDrive'

import {
  deleteIfExist,
  exists,
  mkdirIfNotExist,
  readFileIfExist,
  writeFileIfNotExist,
} from 'Utils/filesystem'

import { pathToArray } from 'Utils/paths'

export default class FSDrive implements IDrive {
  public basePath = ''

  public use(basePath: string) {
    this.basePath = basePath
  }

  public getFullPath(filepath: string) {
    return path.resolve(this.basePath, ...pathToArray(filepath))
  }

  public async put(filepath: string, content: Buffer) {
    const fullPath = this.getFullPath(filepath)

    await writeFileIfNotExist(fullPath, content.toString())
  }

  public async delete(filepath: string) {
    const fullPath = this.getFullPath(filepath)

    await deleteIfExist(fullPath)
  }

  public exists(filepath: string) {
    const fullPath = this.getFullPath(filepath)

    return exists(fullPath)
  }

  public async stat(filepath: string) {
    const fullPath = this.getFullPath(filepath)

    return fs
      .stat(fullPath)
      .then((d) => d)
      .catch(() => null)
  }

  public async mkDir(filepath: string) {
    const fullPath = this.getFullPath(filepath)

    await mkdirIfNotExist(fullPath)
  }

  public async get(filepath: string) {
    const fullPath = this.getFullPath(filepath)

    return readFileIfExist(fullPath)
  }

  public async move(source: string, target: string) {
    const sourceFull = this.getFullPath(source)
    const targetFull = this.getFullPath(target)

    await fs.rename(sourceFull, targetFull)
  }
}
