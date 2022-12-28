import CollectionFacade from '../facades/collection'
import DriveFacade from '../facades/drive'
import ItemFacade from '../facades/item'
import ItemFacade from '../facades/item'
import Drive from '../gateways/drive/drive'
import IWorkspaceRepository from '../repositories/workspace/workspace-repository'

interface Repositories {
    workspace: IWorkspaceRepository
}

interface Facades {
    drive: DriveFacade
    collection: CollectionFacade
    item: ItemFacade
}

export default class AppConfig {
    public drives: Record<string, Drive>
    public repositories: Repositories
    public facades: Facades

    constructor({ drives, repositories }: Omit<AppConfig, 'facades'>) {
        this.drives = drives
        this.repositories = repositories

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
