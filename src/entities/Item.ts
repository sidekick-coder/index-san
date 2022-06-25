export default class Item {
  // id = relative-path in workspace
  public id: string
  public workspaceId: string
  public name: string

  constructor(data: Item) {
    Object.assign(this, data)
  }
}
