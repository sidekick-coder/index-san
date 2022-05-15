import Workspace from 'App/models/workspace'
import { mkdir } from 'fs/promises'
import { resolve } from 'path'
import { v4 as uuid } from 'uuid'
import { removeIfExist } from 'Helpers/filesystem'

export function createWorkspaceFactory() {
  const tmp = resolve(process.cwd(), 'tmp', 'dummy', 'workspaces')

  async function create(name = uuid()) {
    const filepath = resolve(tmp, name)

    await mkdir(filepath, { recursive: true })

    return await Workspace.create(filepath)
  }

  function createMany(count = 5) {
    return Promise.all(
      Array(count)
        .fill(null)
        .map(() => create())
    )
  }

  async function cleanup() {
    await removeIfExist(tmp)
  }

  return { create, createMany, cleanup }
}
