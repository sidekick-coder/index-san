import Workspace from '../../entities/workspace'
import DriveManager from '../../gateways/drive-manager'
import IWorkspaceRepository from '../../repositories/workspace-repository'
import CreateWorkspaceDTO from './create-workspace.dto'

export default class CreateWorkspace {
    constructor(
        private readonly repository: IWorkspaceRepository,
        private readonly drive: DriveManager
    ){

    }
    
    public async execute(args: CreateWorkspaceDTO.Input){

        const validDrives = Object.keys(this.drive.listDrives())

        if (!validDrives.includes(args.drive)) {
            throw new Error('Invalid drive')
        }

        const workspace = new Workspace(args, args.id)

        await this.repository.create(workspace)

        return workspace
    }
}