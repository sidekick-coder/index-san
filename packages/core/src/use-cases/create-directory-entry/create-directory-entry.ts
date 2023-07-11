import DirectoryEntry from '../../entities/directory-entry'
import DirectoryEntryAlreadyExists from '../../exceptions/directory-entry-already-exists'
import DriveHelper from '../../gateways/drive/helper'

import type AppConfig from '../../config/app'
import type CreateDirectoryEntryDTO from './create-directory-entry.dto'

export default class CreateDirectoryEntry {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, data }: CreateDirectoryEntryDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        if (await drive.exists(data.path)) {
            throw new DirectoryEntryAlreadyExists(data.path)
        }

        const entry = new DirectoryEntry(data)

        if (data.type === 'directory') {
            await drive.mkdir(data.path)
        }

        if (data.type === 'file') {
            await drive.write(data.path, DriveHelper.encode(''))
        }

        return { data: entry }
    }
}
