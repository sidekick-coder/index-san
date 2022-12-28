import CollectionFacade from '../facades/collection'
import DriveFacade from '../facades/drive'
import ItemFacade from '../facades/item'
import Drive from '../gateways/drive/drive'
import IEvaluationService from '../gateways/evaluation/evaluation'
import IWorkspaceRepository from '../repositories/workspace/workspace-repository'

interface Repositories {
    workspace: IWorkspaceRepository
}

interface Facades {
    drive: DriveFacade
    collection: CollectionFacade
    item: ItemFacade
}

interface Services {
    evaluation: IEvaluationService
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
        const itemFacade = new ItemFacade(collectionFacade)

        this.facades = {
            drive: driveFacade,
            collection: collectionFacade,
            item: itemFacade,
        }
    }
}
