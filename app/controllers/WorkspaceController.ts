import Workspace from '../models/Workspace'
import { ISEventContext } from '../../lib/ISEventContext'

import { injectable, inject } from 'tsyringe'

import IndexSan from 'IndexSan'

@injectable()
export default class WorkspaceController {
  constructor(@inject(IndexSan) public app: IndexSan) {}

  public async index() {
    return Workspace.all()
  }

  public async store() {
    const { filePaths } = await this.app.electron.dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections'],
    })

    for (const path of filePaths) {
      await Workspace.create(path)
    }

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
