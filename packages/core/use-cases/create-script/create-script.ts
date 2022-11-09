import Script from '../../entities/script'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import CreateScriptDTO from './create-script.dto'

export default class CreateScript {
    constructor(private readonly app: AppService){}

    public async execute({ workspaceId, data }: CreateScriptDTO.Input): Promise<CreateScriptDTO.Output> {

        const workspace = await WorkspaceService.from(this.app, workspaceId)

        await workspace.drive.write(`.is/scripts/${data.name}.js`, Buffer.from(data.content))

        const script = new Script(data, `${data.name}.js`)

        return {
            data: script
        }
    }
}