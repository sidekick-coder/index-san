import AppService from '../../services/app-service'
import WorkspaceService from '../../services/workspace-service'
import ListDirectoryEntryDTO from './list-directory.dto'

export default class ListDirectoryEntry {
    constructor(private readonly app: AppService) {}

    public async execute({
        workspaceId,
        path,
    }: ListDirectoryEntryDTO.Input): Promise<ListDirectoryEntryDTO.Output> {
        const workspace = await WorkspaceService.from(this.app, workspaceId)

        const entries = await workspace.drive.list(path || '/')

        return {
            data: entries,
        }
    }
}
