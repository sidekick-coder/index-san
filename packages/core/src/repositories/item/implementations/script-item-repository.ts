import Collection from '../../../entities/collection'
import Item from '../../../entities/item'
import type IEvaluationService from '../../../gateways/evaluation/evaluation'
import type IItemRepository from '../item-repository'

export default class ScriptItemRepository implements IItemRepository {
    constructor(
        public readonly collection: Collection,
        public readonly evaluation: IEvaluationService
    ) {}

    public async list(): Promise<Item[]> {
        throw new Error('Method not implemented.')
    }

    public async show(_id: string): Promise<Item> {
        throw new Error('Method not implemented.')
    }

    public create(_payload: Item): Promise<Item> {
        throw new Error('Method not implemented.')
    }

    public update(_id: string, _payload: Partial<Item>): Promise<Item> {
        throw new Error('Method not implemented.')
    }

    public destroy(_id: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
