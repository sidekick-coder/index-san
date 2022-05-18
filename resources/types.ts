export interface Workspace {
  name: string
  path: string
}

export interface Item {
  name: string
  path: string
  index: string | null
  workspace: Workspace
}

export interface File {
  name: string
  path: string
  workspace: Workspace
  item: Item
}
