import WorkspaceRepository from '../../repositories/workspace-repository'
import { ListWorkspacesDTO } from './list-workspaces.dto'

export default class ListWorkspaces {
    constructor(private readonly repository: WorkspaceRepository) {}

    public async execute(_args?: ListWorkspacesDTO.Input): Promise<ListWorkspacesDTO.Output> {
        
        const workspaces = await this.repository.findAll()

        const data = workspaces.map(w => ({
            id: w.id,
            name: w.name,
            drive: w.drive,
            path: w.path,
            config: w.config,
        }))

        return { data }
    }
}