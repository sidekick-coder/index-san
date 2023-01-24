import Collection from '../../../entities/collection'
import Item from '../../../entities/item'
import IEvaluationService from '../../../gateways/evaluation/evaluation'
import IItemRepository from '../item-repository'

export default class ScriptItemRepository implements IItemRepository {
    constructor(
        public readonly collection: Collection,
        public readonly evaluation: IEvaluationService
    ) {}

    public async list(): Promise<Item[]> {
        throw new Error('Method not implemented.')
    }

    public async show(id: string): Promise<Item> {
        throw new Error('Method not implemented.')
    }

    public create(payload: Item): Promise<Item> {
        throw new Error('Method not implemented.')
    }

    public update(id: string, payload: Partial<Item>): Promise<Item> {
        throw new Error('Method not implemented.')
    }

    public destroy(id: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
