import { v4 as uuid } from 'uuid'
import Workspace from 'App/models/Workspace'
import Item from 'App/models/Item'

export function createItemFactory() {
  async function create(workspace: Workspace, name = uuid()) {
    return await Item.create(workspace.name, name)
  }

  return { create }
}
