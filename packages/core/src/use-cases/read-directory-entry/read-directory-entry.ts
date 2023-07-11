import type AppConfig from '../../config/app'
import type ReadDirectoryEntryDTO from './read-directory-entry.dto'

export default class ReadDirectoryEntry {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, path }: ReadDirectoryEntryDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        const content = await drive.read(path)

        return content
    }
}
