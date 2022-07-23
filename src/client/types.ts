export interface Workspace {
  id: string
  name: string
  displayName: string
  path: string
}

export interface Item {
  id: string
  name: string
  workspaceId: string
  type: 'file' | 'folder'
  filepath: string
}

export interface DatabaseTableColumn {
  name: string
  type: string
}
export interface DatabaseTable {
  id: string
  name: string
  type: 'folder'
  config: any
  columns: DatabaseTableColumn[]
}
