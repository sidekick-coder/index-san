import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import ShowWorkspaceOptionsDTO from './show-workspace-options.dto'

export default class ShowWorkspaceOptions {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly drive: DriveManager
    ){}
    public async execute({ workspaceId }: ShowWorkspaceOptionsDTO.Input): Promise<ShowWorkspaceOptionsDTO.Output> {
        const workspace = await this.workspaceRepository.findById(workspaceId)

        if (!workspace) throw new Error('Workspace not found')

        let data = {}

        const contents = await this.drive.read('.is/options.json')

        if (contents) {
            data = JSON.parse(contents.toString())
        }

        return { data }
    }
}