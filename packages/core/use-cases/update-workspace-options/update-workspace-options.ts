import DriveHelper from '../../gateways/drive/helper'
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
            options = DriveHelper.toObject(contents)
        }

        Object.assign(options, data)

        await workspace.drive.write('.is/options.json', DriveHelper.encode(options))
    }
}
