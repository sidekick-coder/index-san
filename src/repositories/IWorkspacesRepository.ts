import Workspace from 'Entities/Workspace'

export default interface IWorkspacesRepository {
  index(): Promise<Workspace[]>
  findById(id?: string): Promise<Workspace | null>
  create(data: Workspace): Promise<Workspace>
  destroy(id: string): Promise<void>
}
