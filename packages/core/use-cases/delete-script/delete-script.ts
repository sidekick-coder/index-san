import DeleteScriptDTO from './delete-script.dto'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'

export default class DeleteScript {
    constructor(private readonly app: AppService) {}

    public async execute({ workspaceId, name }: DeleteScriptDTO.Input): Promise<void> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const filename = `.is/scripts/${name}.js`

        const exists = await workspace.drive.exists(filename)

        if (!exists) throw new Error('Script not found')

        await workspace.drive.delete(filename)
    }
}
