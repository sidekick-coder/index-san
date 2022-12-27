import AppService from '../../services/app-service'
import UpdateWorkspaceDTO from './update-workspace.dto'

export default class UpdateWorkspace {
    constructor(private readonly app: AppService) {}

    public async execute({ id, data }: UpdateWorkspaceDTO.Input) {
        await this.app.repositories.workspace.update(id, data)
    }
}
