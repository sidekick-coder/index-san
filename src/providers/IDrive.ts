import Workspace from 'Entities/Workspace'

export default interface IDrive {
  get: (workspace: Workspace, path: string) => Promise<Buffer | null>
}
