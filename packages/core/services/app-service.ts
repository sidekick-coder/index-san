import CrudManager from '../gateways/crud-manager'
import DriveManager from '../gateways/drive-manager'
import IWorkspaceRepository from '../repositories/workspace-repository'

export interface AppServiceArgs {
    workspaceRepository: IWorkspaceRepository
    driveManager: DriveManager
    crudManger: CrudManager
}

interface Managers {
    drive: DriveManager
    crud: CrudManager
}

interface Repositories {
    workspace: IWorkspaceRepository
}

export default class AppService {    
    public managers: Managers
    public repositories: Repositories

    constructor({ workspaceRepository, driveManager, crudManger }: AppServiceArgs){
        this.repositories = {
            workspace: workspaceRepository
        }

        this.managers = {
            drive: driveManager,
            crud: crudManger
        }
    }
}
