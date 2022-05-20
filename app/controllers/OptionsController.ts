import Option from 'App/models/Option'
import Workspace from 'App/models/workspace'
import { isDirectory, systemResolve } from 'Helpers/filesystem'
import IndexSan from 'IndexSan'
import { ISEventContext } from 'lib/ISEventContext'
import { basename, dirname } from 'path'
import { inject, injectable } from 'tsyringe'

@injectable()
export default class OptionsController {
  constructor(@inject(IndexSan) public app: IndexSan) {}

  public async show({ params }: ISEventContext) {
    const { path, workspaceName } = params

    const workspace = await Workspace.findOrFail(workspaceName)

    const realPath = workspace.systemResolve(path)

    const isItem = await isDirectory(realPath)

    let optionsFilePath = systemResolve(dirname(realPath), '.index-san', 'options.json')

    if (isItem) {
      optionsFilePath = systemResolve(realPath, '.index-san', 'options.json')
    }

    const option = await Option.from(optionsFilePath).find(path)

    return option ? option.value : {}
  }

  public async update({ params, data }: ISEventContext) {
    const { path, workspaceName } = params

    const workspace = await Workspace.findOrFail(workspaceName)

    const realPath = workspace.systemResolve(path)

    const isItem = await isDirectory(realPath)

    let optionsFilePath = systemResolve(dirname(realPath), '.index-san', 'options.json')

    if (isItem) {
      optionsFilePath = systemResolve(realPath, '.index-san', 'options.json')
    }

    await Option.from(optionsFilePath).set(path, data)

    const contents = this.app.electron.webContents.getAllWebContents()

    contents.forEach((w) =>
      w.send('option:updated', {
        name: path,
        data,
      })
    )
  }
}
