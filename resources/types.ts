export interface Workspace {
  name: string
  path: string
}

export interface Item {
  name: string
  path: string
  systemPath: string
  index: string | null
  workspace: Workspace
}

export interface ItemOption {
  displayName?: string
}

export interface File {
  name: string
  path: string
  systemPath: string
  workspace: Workspace
  item: Item
}
