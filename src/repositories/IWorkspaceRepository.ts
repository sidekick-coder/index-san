import Workspace from 'Entities/Workspace'

export default interface IWorkspaceRepository {
  create(data: Workspace): Promise<Workspace>
}
