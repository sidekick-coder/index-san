import AppConfig from '../../config/app'
import DirectoryEntryNotFound from '../../exceptions/directory-entry-not-found'
import DeleteDirectoryEntryDTO from './delete-directory-entry.dto'

export default class DeleteDirectoryEntry {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, path }: DeleteDirectoryEntryDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        if (!(await drive.exists(path))) {
            throw new DirectoryEntryNotFound(path)
        }

        await drive.delete(path)
    }
}
