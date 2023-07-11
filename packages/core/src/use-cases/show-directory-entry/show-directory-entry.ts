import DirectoryEntryNotFound from '../../exceptions/directory-entry-not-found'

import type AppConfig from '../../config/app'
import type ShowDirectoryEntryDTO from './show-directory-entry.dto'

export default class ShowDirectoryEntry {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, path }: ShowDirectoryEntryDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        const entry = await drive.get(path)

        if (!entry) throw new DirectoryEntryNotFound(path)

        return {
            data: entry,
        }
    }
}
