import Config from './Config'

export default class Item {
  // workspace-path
  public path: string
  public workspaceId: string
  public name: string

  public config?: any

  constructor(data: Item) {
    Object.assign(this, data)
  }
}
