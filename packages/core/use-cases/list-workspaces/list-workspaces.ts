import AppService from '../../services/app-service'
import { ListWorkspacesDTO } from './list-workspaces.dto'

export default class ListWorkspaces {
    constructor(private readonly app: AppService) {}

    public async execute(_args?: ListWorkspacesDTO.Input): Promise<ListWorkspacesDTO.Output> {
        const workspaces = await this.app.repositories.workspace.list()

        return { data: workspaces }
    }
}
