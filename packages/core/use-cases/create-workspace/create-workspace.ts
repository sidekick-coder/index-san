import Workspace from '../../entities/workspace'
import AppService from '../../services/app-service'
import CreateWorkspaceDTO from './create-workspace.dto'

export default class CreateWorkspace {
    constructor(private readonly app: AppService) {}

    public async execute(args: CreateWorkspaceDTO.Input) {
        const validDrives = Object.keys(this.app.managers.drive.listDrives())

        if (!validDrives.includes(args.driveName)) {
            throw new Error('Invalid drive')
        }

        const workspace = new Workspace(args, args.id)

        await this.app.repositories.workspace.create(workspace)

        return workspace
    }
}
