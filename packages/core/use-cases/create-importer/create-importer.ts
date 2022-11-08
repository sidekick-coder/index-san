import Importer from '../../entities/importer'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import CreateImporterDTO from './create-importer.dto'

export default class CreateImporter {
    constructor(private readonly app: AppService){}

    public async execute({ workspaceId, data }: CreateImporterDTO.Input): Promise<CreateImporterDTO.Output> {

        const workspace = await WorkspaceService.from(this.app, workspaceId)

        await workspace.drive.write(`.is/importers/${data.id}.js`, Buffer.from(data.content))

        const importer = new Importer({ content: data.content }, data.id)

        return {
            data: importer
        }
    }
}