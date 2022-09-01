import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import ShowDirectoryEntryDTO from './show-directory-entry.dto'

export default class ShowDirectoryEntry {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        public readonly drive: DriveManager
    ){}

    public async execute({ workspaceId, path }: ShowDirectoryEntryDTO.Input): Promise<ShowDirectoryEntryDTO.Output> {

        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        const entry = await this.drive
            .use(workspace.drive)
            .config(workspace.config)
            .get(path)

        if (!entry) throw new Error('DirectoryEntry not found')


        return {
            data: entry
        }

    }
}