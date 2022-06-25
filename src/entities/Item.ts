export default class Item {
  public id: string
  public workspaceId: string
  public name: string
  public type: 'file' | 'folder'

  // id = relative-path inside workspace
  public filepath: string

  constructor(data: Item) {
    Object.assign(this, data)
  }
}
