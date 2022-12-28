import ExecuteScriptDTO from './execute-script.dto'
import AppConfig from '../../config/app'
import DirectoryEntry from '../../entities/directory-entry'
export default class ExecuteScript {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, content }: ExecuteScriptDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        const scope = {
            Drive: drive,
            Facades: this.app.facades,
            Entry: DirectoryEntry,
        }

        return this.app.services.evaluation.evaluate(content, scope)
    }
}
