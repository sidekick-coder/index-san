import WorkspaceRepository from '../../repositories/workspace-repository'
import { ListWorkspacesInput, ListWorkspacesOutput } from './list-workspaces.dto'

export default class ListWorkspaces {
    constructor(private readonly repository: WorkspaceRepository) {}

    public async execute(_args: ListWorkspacesInput): Promise<ListWorkspacesOutput> {
        
        const workspaces = await this.repository.index()

        const data = workspaces.map(w => ({
            id: w.id,
            name: w.name,
            drive: w.drive,
            path: w.path
        }))

        return { data }
    }
}