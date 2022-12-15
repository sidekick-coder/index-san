import ShowViewsDTO from './show-views.dto'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import DirectoryEntry from '../../entities/directory-entry'
import View from '../../entities/view'

export default class ShowViews {
    constructor(private readonly app: AppService) {}

    public async execute({
        workspaceId,
        collectionId,
    }: ShowViewsDTO.Input): Promise<ShowViewsDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const collection = await workspace.collection(collectionId)

        const filename = DirectoryEntry.normalize(collection.path, '.is', 'views.json')

        const entry = await workspace.drive.read(filename)

        let views: View[] = []

        if (entry) {
            views = JSON.parse(entry.toString())
        }

        return {
            data: views,
        }
    }
}
