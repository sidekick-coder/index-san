import { RepositoryType } from '../entities/collection'
import Workspace from '../entities/workspace'
import IEvaluationService from '../gateways/evaluation/evaluation'
import EntryItemRepository from '../repositories/item/implementations/entry-item-repository'
import ScriptItemRepository from '../repositories/item/implementations/script-item-repository'
import CollectionFacade from './collection'

export default class ItemFacade {
    constructor(
        public readonly collectionFacade: CollectionFacade,
        public readonly evaluation: IEvaluationService
    ) {}

    public async createRepositoryFromWorkspace(workspace: Workspace, collectionId: string) {
        const repository = this.collectionFacade.createRepository(workspace)

        const collection = await repository.show(collectionId)

        if (collection.repositoryType === RepositoryType.Script) {
            return new ScriptItemRepository(collection, this.evaluation)
        }

        return new EntryItemRepository(collection, repository.drive)
    }
}
