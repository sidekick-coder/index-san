export default class Item {
  // workspace-path
  public id: string
  public workspaceId: string
  public name: string
  public displayName: string

  constructor(data: Item) {
    Object.assign(this, data)
  }
}
