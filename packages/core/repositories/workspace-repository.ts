import Workspace from "../entities/workspace";

export default interface IWorkspaceRepository {
    findAll(): Promise<Workspace[]>
    findById(id: string): Promise<Workspace | null>
    create(workspace: Workspace): Promise<Workspace>
    updateById(id: string, data: Partial<Omit<Workspace, 'id'>>): Promise<void>
    delete(id: string): Promise<void>
}