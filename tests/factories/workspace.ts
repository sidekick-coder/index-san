import Workspace from 'App/models/workspace'
import { resolve } from 'path'
import { v4 as uuid } from 'uuid'
import { mkdirIfNotExist, removeIfExist } from 'Helpers/filesystem'

export function createWorkspaceFactory() {
  const tmp = resolve(process.cwd(), 'tmp', 'dummy', 'workspaces')

  async function create(name = uuid()) {
    const filepath = resolve(tmp, name)

    await mkdirIfNotExist(filepath)

    return Workspace.create(filepath)
  }

  async function createMany(count = 5) {
    const workspaces = []

    for (let i = 0; i < count; i++) {
      workspaces.push(await create())
    }

    return workspaces
  }

  async function cleanup() {
    await Workspace.query().delete()
    await removeIfExist(tmp)
  }

  return { create, createMany, cleanup }
}
