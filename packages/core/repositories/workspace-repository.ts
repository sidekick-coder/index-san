import Workspace from "../entities/workspace";

export default interface WorkspaceRepository {
    findAll(): Promise<Workspace[]>
    findById(id: string): Promise<Workspace | null>
    create(workspace: Workspace): Promise<Workspace>
}