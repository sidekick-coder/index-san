import type AppConfig from '../../config/app'
import type ListDirectoryEntryDTO from './list-directory.dto'

export default class ListDirectoryEntry {
    constructor(private readonly app: AppConfig) {}

    public async execute({ workspaceId, path }: ListDirectoryEntryDTO) {
        const workspace = await this.app.repositories.workspace.show(workspaceId)

        const drive = this.app.facades.drive.fromWorkspace(workspace)

        const entries = await drive.list(path || '/')

        return {
            data: entries,
        }
    }
}
