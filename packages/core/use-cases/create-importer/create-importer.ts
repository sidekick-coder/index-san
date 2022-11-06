import Importer from '../../entities/importer'
import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import CreateImporterDTO from './create-importer.dto'

export default class CreateImporter {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly drive: DriveManager<any>
    ){}

    public async execute({ workspaceId, data }: CreateImporterDTO.Input): Promise<CreateImporterDTO.Output> {

        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        this.drive.use(workspace.drive)

        
        await this.drive.write(`.is/importers/${data.id}.js`, Buffer.from(data.content))
        
        const importer = new Importer({ content: data.content }, data.id)


        return {
            data: importer
        }
    }
}