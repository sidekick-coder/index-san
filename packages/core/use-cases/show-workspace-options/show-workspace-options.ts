import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import ShowWorkspaceOptionsDTO from './show-workspace-options.dto'

export default class ShowWorkspaceOptions {
    constructor(private readonly app: AppService) {}

    public async execute({
        workspaceId,
    }: ShowWorkspaceOptionsDTO.Input): Promise<ShowWorkspaceOptionsDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        let data = {}

        const contents = await workspace.drive.read('.is/options.json')

        if (contents) {
            data = JSON.parse(contents.toString())
        }

        return { data }
    }
}
