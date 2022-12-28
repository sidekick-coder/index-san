import AppConfig from '../../config/app'
import DeleteWorkspaceDto from './delete-workspace.dto'

export default class DeleteWorkspace {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId }: DeleteWorkspaceDto) {
        await this.app.repositories.workspace.destroy(workspaceId)
    }
}
