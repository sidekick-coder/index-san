import Workspace from '../entities/workspace'
import EntryItemRepository from '../repositories/item/implementations/entry-item-repository'
import CollectionFacade from './collection'

export default class ItemFacade {
    constructor(public readonly collectionFacade: CollectionFacade) {}

    public async createRepositoryFromWorkspace(workspace: Workspace, collectionId: string) {
        const repository = this.collectionFacade.createRepository(workspace)

        const collection = await repository.show(collectionId)

        return new EntryItemRepository(collection, repository.drive)
    }
}
