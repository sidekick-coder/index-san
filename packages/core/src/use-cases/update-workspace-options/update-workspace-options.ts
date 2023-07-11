import DriveHelper from '../../gateways/drive/helper'

import type AppConfig from '../../config/app'
import type UpdateWorkspaceOptionsDTO from './update-workspace-options.dto'

export default class UpdateWorkspaceOptions {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, data }: UpdateWorkspaceOptionsDTO.Input): Promise<void> {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        let options = {}

        const contents = await drive.read('.is/options.json')

        if (contents) {
            options = DriveHelper.toObject(contents)
        }

        Object.assign(options, data)

        await drive.write('.is/options.json', DriveHelper.encode(options))
    }
}
