export interface Workspace {
  id: string
  name: string
  displayName: string
  path: string
}
export interface MetaRelation {
  name: string
  type: 'belongsTo' | 'hasMany'
  value: string
}

export interface Item {
  [key: string]: any
  id: string
  name: string
  workspaceId: string
  type: 'file' | 'folder'
  relations?: MetaRelation[]
}

export interface ItemOption {
  displayName?: string
}

export interface File {
  name: string
  displayName: string
  path: string
  systemPath: string
  workspace: Workspace
  item: Item
}
