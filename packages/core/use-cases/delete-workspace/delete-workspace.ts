import AppService from '../../services/app-service'
import DeleteWorkspaceDto from './delete-workspace.dto'

export default class DeleteWorkspace {
    constructor(private readonly app: AppService) {}

    public async execute({ id }: DeleteWorkspaceDto.Input) {
        await this.app.repositories.workspace.destroy(id)
    }
}
