import UpdateMenuDTO from './update-menu.dto'
import AppConfig from '../../config/app'
import DriveHelper from '../../gateways/drive/helper'

export default class UpdateMenu {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, data }: UpdateMenuDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        await drive.write('.is/menu.json', DriveHelper.encode(data))
    }
}
