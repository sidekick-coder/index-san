import CrudManager from '../gateways/crud-manager'
import DriveManager from '../gateways/drive/manager'
import IEvaluationService from '../gateways/evaluation/evaluation'
import ICollectionRepository from '../repositories/collection/collection-repository'
import IWorkspaceRepository from '../repositories/workspace/workspace-repository'

interface Managers {
    drive: DriveManager
    crud: CrudManager
}

interface Repositories {
    workspace: IWorkspaceRepository
    collection: ICollectionRepository
}

export interface AppServiceArgs {
    repositories: Repositories
    managers: Managers
    evaluation: IEvaluationService
}

export default class AppService {
    public managers: Managers
    public repositories: Repositories
    public evaluation: IEvaluationService

    constructor({ repositories, managers, evaluation }: AppServiceArgs) {
        this.repositories = repositories

        this.managers = managers

        this.evaluation = evaluation
    }
}
