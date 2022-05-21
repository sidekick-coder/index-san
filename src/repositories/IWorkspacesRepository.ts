import Workspace from 'Entities/Workspace'

export default interface IWorkspaceRepository {
  index(): Promise<Workspace[]>
  create(data: Workspace): Promise<Workspace>
}
