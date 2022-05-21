export default class ItemNotFound extends Error {
  constructor(workspaceId: string, path: string) {
    super(`Item ${path} not found in workspace ${workspaceId}`)
  }
}
