import DriveHelper from '../../gateways/drive/helper'

import type UpdateMenuDTO from './update-menu.dto'
import type AppConfig from '../../config/app'

export default class UpdateMenu {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, data }: UpdateMenuDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        await drive.write('.is/menu.json', DriveHelper.encode(data))
    }
}
