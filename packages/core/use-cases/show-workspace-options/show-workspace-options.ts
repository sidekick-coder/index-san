import AppConfig from '../../config/app'
import DriveHelper from '../../gateways/drive/helper'
import ShowWorkspaceOptionsDTO from './show-workspace-options.dto'

export default class ShowWorkspaceOptions {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId }: ShowWorkspaceOptionsDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        let data = {}

        const contents = await drive.read('.is/options.json')

        if (contents) {
            data = DriveHelper.toObject(contents)
        }

        return { data }
    }
}
