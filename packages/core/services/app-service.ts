import CrudManager from '../gateways/crud-manager'
import DriveManager from '../gateways/drive-manager'
import IEvaluationService from '../gateways/evaluation/evaluation'
import IWorkspaceRepository from '../repositories/workspace-repository'

export interface AppServiceArgs {
    workspaceRepository: IWorkspaceRepository
    driveManager: DriveManager
    crudManger: CrudManager
    evaluation: IEvaluationService
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
    public evaluation: IEvaluationService

    constructor({ workspaceRepository, driveManager, crudManger, evaluation }: AppServiceArgs) {
        this.repositories = {
            workspace: workspaceRepository,
        }

        this.managers = {
            drive: driveManager,
            crud: crudManger,
        }

        this.evaluation = evaluation
    }
}
