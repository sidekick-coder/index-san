import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import UpdateWorkspaceOptionsDTO from './update-workspace-options.dto'

export default class UpdateWorkspaceOptions {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly drive: DriveManager
    ){}

    public async execute({ workspaceId, data }: UpdateWorkspaceOptionsDTO.Input): Promise<void> {
        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        let options = {}

        const contents = await this.drive.read('.is/options.json')

        if (contents) {
            options = JSON.parse(contents.toString())
        }

        Object.assign(options, data)

        const text = JSON.stringify(options, undefined, 4)

        await this.drive.write('.is/options.json', Buffer.from(text))
    }
}