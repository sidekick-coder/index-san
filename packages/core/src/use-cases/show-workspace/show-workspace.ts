import type AppConfig from '../../config/app'
import type ShowWorkspaceDTO from './show-workspace.dto'

export default class ShowWorkspace {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId }: ShowWorkspaceDTO) {
        return this.app.repositories.workspace.show(workspaceId)
    }
}
