import Workspace from "../entities/workspace";

export default interface IWorkspaceRepository {
    findAll(): Promise<Workspace[]>
    findById(id: string): Promise<Workspace | null>
    create(workspace: Workspace): Promise<Workspace>
    delete(id: string): Promise<void>
}