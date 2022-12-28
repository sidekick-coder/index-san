import ShowMenuDTO from './show-menu.dto'
import DriveHelper from '../../gateways/drive/helper'
import AppConfig from '../../config/app'

export default class ShowMenu {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId }: ShowMenuDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        const content = await drive.read('.is/menu.json')

        const data = content ? DriveHelper.toArray(content) : []

        return {
            data,
        }
    }
}
