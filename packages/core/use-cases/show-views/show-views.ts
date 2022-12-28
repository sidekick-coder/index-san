import ShowViewsDTO from './show-views.dto'
import DirectoryEntry from '../../entities/directory-entry'
import View from '../../entities/view'
import DriveHelper from '../../gateways/drive/helper'
import AppConfig from '../../config/app'

export default class ShowViews {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, collectionId }: ShowViewsDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        const repository = this.app.facades.collection.createRepository(workspace)

        const collection = await repository.show(collectionId)

        const filename = DirectoryEntry.normalize(collection.path, '.is', 'views.json')

        const entry = await drive.read(filename)

        let views: View[] = []

        if (entry) {
            views = DriveHelper.toArray(entry)
        }

        return {
            data: views,
        }
    }
}
