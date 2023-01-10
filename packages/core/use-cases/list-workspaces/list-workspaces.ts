import type AppConfig from '../../config/app'

export default class ListWorkspaces {
    constructor(private readonly app: AppConfig) {}

    public async execute() {
        const workspaces = await this.app.repositories.workspace.list()

        return { data: workspaces }
    }
}
