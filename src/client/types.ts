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

interface ItemMeta {
  [key: string]: any
  relations?: MetaRelation[]
}

export interface Item {
  id: string
  name: string
  workspaceId: string
  metas?: ItemMeta
  type: 'file' | 'folder'
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
