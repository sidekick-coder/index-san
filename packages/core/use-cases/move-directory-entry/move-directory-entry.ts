import MoveDirectoryEntryDTO from './move-directory-entry.dto'
import type AppConfig from '../../config/app'
import DirectoryEntryNotFound from '../../exceptions/directory-entry-not-found'

export default class MoveDirectoryEntry {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, sourcePath, targetPath }: MoveDirectoryEntryDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        if (!(await drive.exists(sourcePath))) {
            throw new DirectoryEntryNotFound(sourcePath)
        }

        if (await drive.exists(targetPath)) {
            throw new DirectoryEntryNotFound(targetPath)
        }

        await drive.move(sourcePath, targetPath)
    }
}
