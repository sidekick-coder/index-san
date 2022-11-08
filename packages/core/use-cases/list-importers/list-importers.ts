import Importer from '../../entities/importer'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import ListImportersDTO from './list-importers.dto'

export default class ListImporters {
    constructor(private readonly app: AppService){}

    public async execute({ workspaceId }: ListImportersDTO.Input): Promise<ListImportersDTO.Output> {

        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const importers: Importer[] = []
        
        const entries = await workspace.drive.list('.is/importers')

        for await (const entry of entries) {
            const buffer = await workspace.drive.read(entry.path)

            const content = buffer?.toString() ?? ''

            importers.push(new Importer({ content }, entry.name))
        }


        return {
            data: importers
        }
    }
}