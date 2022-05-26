export default class Item {
  // workspace-path
  public path: string
  public workspaceId: string
  public name: string
  public type: 'file' | 'folder'

  public metas?: any = {}

  constructor(data: Item) {
    Object.assign(this, data)
  }
}
