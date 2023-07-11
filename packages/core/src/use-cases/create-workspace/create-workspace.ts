import Workspace from '../../entities/workspace'

import type AppConfig from '../../config/app'
import type CreateWorkspaceDTO from './create-workspace.dto'

export default class CreateWorkspace {
    constructor(private readonly app: AppConfig) {}

    public async execute(payload: CreateWorkspaceDTO) {
        // check if drive is valid
        this.app.facades.drive.validate(payload.driveName)

        const workspace = new Workspace(payload, payload.id)

        await this.app.repositories.workspace.create(workspace)

        return workspace
    }
}
