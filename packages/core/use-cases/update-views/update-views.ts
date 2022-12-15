import UpdateViewsDTO from './update-views.dto'
import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import DirectoryEntry from '../../entities/directory-entry'

export default class UpdateViews {
    constructor(private readonly app: AppService) {}

    public async execute({
        workspaceId,
        collectionId,
        data,
    }: UpdateViewsDTO.Input): Promise<UpdateViewsDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const collection = await workspace.collection(collectionId)

        const filename = DirectoryEntry.normalize(collection.path, '.is', 'views.json')

        await workspace.drive.write(filename, JSON.stringify(data))

        return {}
    }
}
