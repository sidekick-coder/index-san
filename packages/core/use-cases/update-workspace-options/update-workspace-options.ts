import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import UpdateWorkspaceOptionsDTO from './update-workspace-options.dto'

export default class UpdateWorkspaceOptions {
    constructor(private readonly app: AppService) {}

    public async execute({ workspaceId, data }: UpdateWorkspaceOptionsDTO.Input): Promise<void> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        let options = {}

        const contents = await workspace.drive.read('.is/options.json')

        if (contents) {
            options = JSON.parse(contents.toString())
        }

        Object.assign(options, data)

        const text = JSON.stringify(options, undefined, 4)

        await workspace.drive.write('.is/options.json', Buffer.from(text))
    }
}
