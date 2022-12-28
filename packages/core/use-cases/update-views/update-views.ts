import UpdateViewsDTO from './update-views.dto'
import DirectoryEntry from '../../entities/directory-entry'
import AppConfig from '../../config/app'
import DriveHelper from '../../gateways/drive/helper'

export default class UpdateViews {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, collectionId, data }: UpdateViewsDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const repository = this.app.facades.collection.createRepository(workspace)

        const collection = await repository.show(collectionId)

        const filename = DirectoryEntry.normalize(collection.path, '.is', 'views.json')

        await repository.drive.write(filename, DriveHelper.encode(data))
    }
}
