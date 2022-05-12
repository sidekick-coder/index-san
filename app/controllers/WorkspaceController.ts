import Workspace from '../models/Workspace'
import { ISEventContext } from '../../lib/ISEventContext'

import { dialog } from 'electron'

export default class WorkspaceController {
  public async index() {
    return Workspace.all()
  }

  public async store() {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections'],
    })

    await Promise.all(filePaths.map(Workspace.create))

    return true
  }

  public async destroy({ data }: ISEventContext) {
    const path = data.path

    const workspace = await Workspace.find(path)

    if (!workspace) {
      throw new Error('Workspace not found')
    }

    return workspace.destroy()
  }
}
