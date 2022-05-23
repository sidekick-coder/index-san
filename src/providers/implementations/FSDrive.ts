import { readFile, stat, writeFile } from 'fs/promises'
import { resolve } from 'path'

import Workspace from 'Entities/Workspace'
import IDrive from 'Providers/IDrive'

import { pathToArray } from 'Utils/paths'

export default class FSDrive implements IDrive {
  public async get(workspace: Workspace, path: string): Promise<Buffer | null> {
    const filePath = resolve(workspace.path, ...pathToArray(path))

    const fileExist = await stat(filePath)
      .then((s) => s.isFile())
      .catch(() => false)

    if (!fileExist) return null

    return readFile(filePath)
  }

  public async update(workspace: Workspace, path: string, content: Buffer | string) {
    const filePath = resolve(workspace.path, ...pathToArray(path))

    const fileExist = await stat(filePath)
      .then((s) => s.isFile())
      .catch(() => false)

    if (!fileExist) return Promise.resolve()

    return writeFile(filePath, content)
  }
}
