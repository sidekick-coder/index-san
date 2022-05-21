export interface Workspace {
  id: string
  name: string
  displayName: string
  path: string
}

export interface Item {
  name: string
  path: string
  workspaceId: string
  config?: any
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
