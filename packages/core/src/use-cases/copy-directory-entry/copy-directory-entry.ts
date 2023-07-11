import type CopyDirectoryEntryDTO from './copy-directory-entry.dto'
import type AppConfig from '../../config/app'
import DirectoryEntryAlreadyExists from '../../exceptions/directory-entry-already-exists'
import DirectoryEntryNotFound from '../../exceptions/directory-entry-not-found'

export default class CopyDirectoryEntry {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, sourcePath, targetPath }: CopyDirectoryEntryDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        if (!(await drive.exists(sourcePath))) {
            throw new DirectoryEntryNotFound(sourcePath)
        }

        if (await drive.exists(targetPath)) {
            throw new DirectoryEntryAlreadyExists(targetPath)
        }

        await drive.copy(sourcePath, targetPath)
    }
}
