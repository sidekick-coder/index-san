import DirectoryEntry from '../../entities/directory-entry'
import DriveHelper from '../../gateways/drive/helper'

import type UpdateViewsDTO from './update-views.dto'
import type AppConfig from '../../config/app'

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
