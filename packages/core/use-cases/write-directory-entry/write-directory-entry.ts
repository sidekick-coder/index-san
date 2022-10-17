import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import WriteDirectoryEntryDTO from './write-directory-entry.dto'

export default class WriteDirectoryEntry {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        public readonly drive: DriveManager
    ){}

    public async execute({ workspaceId, path, data }: WriteDirectoryEntryDTO.Input) {

        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        this.drive.use(workspace.drive).config(workspace.config)

        const exists = await this.drive.exists(path)

        if (!exists) throw new Error('DirectoryEntry not found')

        if (typeof data === 'string') {
            data = Buffer.from(data)
        }

        await this.drive.write(path, data)

    }
}