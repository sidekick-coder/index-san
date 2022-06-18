export default class WorkspaceNotFound extends Error {
  constructor() {
    super('Workspace not found')
  }
}
