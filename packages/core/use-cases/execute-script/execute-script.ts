import lodash from 'lodash'

import ExecuteScriptDTO from './execute-script.dto'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import ScriptService from '../../services/script-service'
export default class ExecuteScript {
    constructor(private readonly app: AppService) {}

    public async execute({
        workspaceId,
        name,
    }: ExecuteScriptDTO.Input): Promise<ExecuteScriptDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const filename = `.is/scripts/${name}.js`

        const content = await workspace.drive.read(filename)

        if (!content) {
            throw new Error('Script not found')
        }

        const service = new ScriptService()

        const result = await service.evaluate(content.toString(), {
            workspace,
            lodash,
        })

        return result
    }
}
