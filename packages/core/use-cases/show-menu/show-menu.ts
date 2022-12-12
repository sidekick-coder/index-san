import ShowMenuDTO from './show-menu.dto'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'

export default class ShowMenu {
    constructor(private readonly app: AppService) {}

    public async execute({ workspaceId }: ShowMenuDTO.Input): Promise<ShowMenuDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const content = await workspace.drive.read('.is/menu.json')

        const data = content ? JSON.parse(content.toString()) : []

        return {
            data,
        }
    }
}
