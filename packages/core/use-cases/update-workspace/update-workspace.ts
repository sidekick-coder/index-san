import type AppConfig from '../../config/app'
import type UpdateWorkspaceDTO from './update-workspace.dto'

export default class UpdateWorkspace {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, data }: UpdateWorkspaceDTO) {
        await this.app.repositories.workspace.update(workspaceId, data)
    }
}
