import IItemsRepository from 'Repositories/IItemsRepository'

export default class Item {
  [key: string]: any

  public readonly _repository: IItemsRepository

  // id = relative-path in workspace
  public id: string
  public workspaceId: string
  public name: string
  public type: 'file' | 'folder'

  constructor(data: Omit<Item, 'merge'>) {
    Object.assign(this, data)
  }

  public merge(data: any = {}) {
    Object.keys(data)
      .filter((key) => !Object.keys(this).includes(key))
      .forEach((key) => (this[key] = data[key]))

    return this
  }
}
