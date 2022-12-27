import ExecuteScriptDTO from './execute-script.dto'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
export default class ExecuteScript {
    constructor(private readonly app: AppService) {}

    public async execute({
        workspaceId,
        content,
    }: ExecuteScriptDTO.Input): Promise<ExecuteScriptDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const result = await this.app.evaluation.evaluate(content, { workspace })

        return result
    }
}
