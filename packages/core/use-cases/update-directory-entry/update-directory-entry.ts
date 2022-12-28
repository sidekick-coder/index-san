import AppConfig from '../../config/app'
import DirectoryEntryNotFound from '../../exceptions/directory-entry-not-found'
import UpdateDirectoryEntryDTO from './update-directory-entry.dto'

export default class UpdateDirectoryEntry {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, path, newPath }: UpdateDirectoryEntryDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        if (!(await drive.exists(path))) {
            throw new DirectoryEntryNotFound(path)
        }

        await drive.move(path, newPath)
    }
}
