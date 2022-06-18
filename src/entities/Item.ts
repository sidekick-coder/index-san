import Metadata from './Metadata'

export default class Item {
  [key: string]: any
  // workspace-path
  public path: string
  public workspaceId: string
  public name: string
  public type: 'file' | 'folder'

  public metas?: Metadata = {}

  constructor(data: Item) {
    Object.assign(this, data)
  }
}
