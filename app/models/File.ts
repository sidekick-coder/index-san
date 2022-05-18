import { stat } from 'fs/promises'
import { exists } from 'Helpers/filesystem'
import Item from './Item'
import Workspace from './workspace'

export default class File {
  public name: string
  public path: string

  public workspace: Workspace
  public item: Item

  public static make(data: Partial<File>) {
    const file = new File()

    Object.assign(file, data)

    return file
  }

  public static async find(workspaceName: string, itemName: string, filename: string) {
    const item = await Item.findOrFail(workspaceName, itemName)

    const filepath = item.workspace.systemResolve(item.name, filename)

    const exist = await exists(filepath)

    if (!exist) {
      return null
    }

    return this.make({
      name: filename,
      path: item.resolve(filename),
      workspace: item.workspace,
      item: item,
    })
  }

  public static async findOrFail(workspaceName: string, itemName: string, filename: string) {
    const file = await this.find(workspaceName, itemName, filename)

    if (!file) {
      throw new Error('File not found')
    }

    return file
  }
}
