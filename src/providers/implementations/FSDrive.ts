import { readFile, stat } from 'fs/promises'
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
}
