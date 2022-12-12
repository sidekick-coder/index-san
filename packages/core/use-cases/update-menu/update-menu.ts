import UpdateMenuDTO from './update-menu.dto'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'

export default class UpdateMenu {
    constructor(private readonly app: AppService) {}

    public async execute({
        workspaceId,
        data,
    }: UpdateMenuDTO.Input): Promise<UpdateMenuDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        await workspace.drive.write('.is/menu.json', JSON.stringify(data, null, 4))

        return {}
    }
}
