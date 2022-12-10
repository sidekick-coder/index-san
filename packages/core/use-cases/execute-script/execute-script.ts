import ExecuteScriptDTO from './execute-script.dto'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import ScriptService from '../../services/script-service'
export default class ExecuteScript {
    constructor(private readonly app: AppService) {}

    public async execute({
        workspaceId,
        content,
    }: ExecuteScriptDTO.Input): Promise<ExecuteScriptDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const service = new ScriptService()

        const result = await service.evaluate(content, { workspace })

        return result
    }
}
