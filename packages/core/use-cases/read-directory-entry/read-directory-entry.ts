import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import ReadDirectoryEntryDTO from './read-directory-entry.dto'

export default class ReadDirectoryEntry {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        public readonly drive: DriveManager
    ){}

    public async execute({ workspaceId, path }: ReadDirectoryEntryDTO.Input): Promise<Buffer> {
        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        this.drive.use(workspace.drive).config(workspace.config)

        const content = await this.drive.read(path)

        if (!content) throw new Error('DirectoryEntry not found')

        return content
    }
}