import Workspace from '../entities/workspace'
import CollectionRepository from '../repositories/collection/implementations/collection-repository'
import DriveFacade from './drive'

export default class CollectionFacade {
    constructor(public readonly driveFacade: DriveFacade) {}

    public createRepository(workspace: Workspace) {
        const drive = this.driveFacade.fromWorkspace(workspace)

        return new CollectionRepository(drive)
    }
}
