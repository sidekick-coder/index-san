import Workspace from "../entities/workspace";

export default interface WorkspaceRepository {
    index(): Promise<Workspace[]>
}