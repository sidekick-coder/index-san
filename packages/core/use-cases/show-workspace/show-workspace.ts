import AppService from '../../services/app-service'
import ShowWorkspaceDTO from './show-workspace.dto'

export default class ShowWorkspace {
    constructor(private readonly app: AppService) {}

    public async execute(args: ShowWorkspaceDTO.Input): Promise<ShowWorkspaceDTO.Output> {
        const workspace = await this.app.repositories.workspace.show(args.id)

        if (!workspace) throw new Error('Workspace not found')

        return workspace
    }
}
