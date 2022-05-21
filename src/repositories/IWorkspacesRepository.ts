import Workspace from 'Entities/Workspace'

export default interface IWorkspacesRepository {
  index(): Promise<Workspace[]>
  create(data: Workspace): Promise<Workspace>
  destroy(id: string): Promise<void>
}
