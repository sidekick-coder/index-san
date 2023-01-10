import DirectoryEntry from '../../entities/directory-entry'

import type ExecuteScriptDTO from './execute-script.dto'
import type AppConfig from '../../config/app'
export default class ExecuteScript {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, content, scope }: ExecuteScriptDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        const sandbox = {
            ...scope,
            Workspace: workspace,
            Drive: drive,
            Facades: this.app.facades,
            Entry: DirectoryEntry,
        }

        return this.app.services.evaluation.evaluate(content, sandbox)
    }
}
