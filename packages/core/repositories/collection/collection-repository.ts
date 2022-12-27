import Collection from '../../entities/collection'

export default interface ICollectionRepository {
    list(): Promise<Collection[]>
    show(id: Collection['id']): Promise<Collection | null>
    create(payload: Collection): Promise<Collection>
    update(id: Collection['id'], payload: Partial<Collection>): Promise<Collection>
    destroy(id: Collection['id']): Promise<void>
}
