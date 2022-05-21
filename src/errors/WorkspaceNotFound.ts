export default class WorkspaceNotFound extends Error {
  constructor(id: string) {
    super(`Workspace with id ${id} not found`)
  }
}
