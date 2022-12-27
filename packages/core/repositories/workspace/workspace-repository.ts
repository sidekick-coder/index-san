import Workspace from '../../entities/workspace'

export default interface IWorkspaceRepository {
    list(): Promise<Workspace[]>
    show(id: string): Promise<Workspace | null>
    create(workspace: Workspace): Promise<Workspace>
    update(id: string, data: Partial<Omit<Workspace, 'id'>>): Promise<void>
    destroy(id: string): Promise<void>
}
