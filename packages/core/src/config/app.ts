import ArrayFacade from '../facades/array'
import CollectionFacade from '../facades/collection'
import DriveFacade from '../facades/drive'
import ItemFacade from '../facades/item'
import type Drive from '../gateways/drive/drive'
import type IEvaluationService from '../gateways/evaluation/evaluation'
import type IFetchService from '../gateways/fetch/fetch'
import type IWorkspaceRepository from '../repositories/workspace/workspace-repository'

interface Repositories {
    workspace: IWorkspaceRepository
}

interface Facades {
    drive: DriveFacade
    collection: CollectionFacade
    item: ItemFacade
    array: typeof ArrayFacade
}

interface Services {
    evaluation: IEvaluationService
    fetch: IFetchService
}

export default class AppConfig {
    public drives: Record<string, Drive>
    public repositories: Repositories
    public facades: Facades
    public services: Services

    constructor({ drives, repositories, services }: Omit<AppConfig, 'facades'>) {
        this.drives = drives
        this.repositories = repositories
        this.services = services

        const driveFacade = new DriveFacade(drives)
        const collectionFacade = new CollectionFacade(driveFacade)
        const itemFacade = new ItemFacade(collectionFacade, services.evaluation)

        this.facades = {
            drive: driveFacade,
            collection: collectionFacade,
            item: itemFacade,
            array: ArrayFacade,
        }
    }
}
