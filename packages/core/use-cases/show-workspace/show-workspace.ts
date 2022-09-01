
import WorkspaceRepository from '../../repositories/workspace-repository'
import ShowWorkspaceDTO from './show-workspace.dto'

export default class ShowWorkspace {
    constructor(
        public repository: WorkspaceRepository
    ){}

    public async execute(args: ShowWorkspaceDTO.Input): Promise<ShowWorkspaceDTO.Output> {
        const workspace = await this.repository.findById(args.id)

        if (!workspace) throw new Error('Workspace not found')

        return workspace
    }
}