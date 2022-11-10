import Importer from '../../entities/script'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import ListScriptsDTO from './list-scripts.dto'

export default class ListScripts {
    constructor(private readonly app: AppService){}

    public async execute({ workspaceId }: ListScriptsDTO.Input): Promise<ListScriptsDTO.Output> {

        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const importers: Importer[] = []
        
        const entries = await workspace.drive.list('.is/scripts')

        for await (const entry of entries) {
            const buffer = await workspace.drive.read(entry.path)

            const content = buffer?.toString() ?? ''

            importers.push(new Importer({ content, name: entry.name.replace('.js', '') }, entry.name))
        }


        return {
            data: importers
        }
    }
}