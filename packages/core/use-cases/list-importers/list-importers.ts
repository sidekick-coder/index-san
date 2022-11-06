import Importer from '../../entities/importer'
import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import ListImportersDTO from './list-importers.dto'

export default class ListImporters {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly drive: DriveManager<any>
    ){}

    public async execute({ workspaceId }: ListImportersDTO.Input): Promise<ListImportersDTO.Output> {

        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        this.drive.use(workspace.drive)

        const importers: Importer[] = []
        
        const entries = await this.drive.list('.is/importers')

        for await (const entry of entries) {
            const buffer = await this.drive.read(entry.path)

            const content = buffer?.toString() ?? ''

            importers.push(new Importer({ content }, entry.name))
        }


        return {
            data: importers
        }
    }
}