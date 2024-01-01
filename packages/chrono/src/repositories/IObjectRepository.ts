import ChronoObject from '../entities/ChronoObject'

export default interface IObjectRepository {
    find(objectHash: string): Promise<ChronoObject | null>
    findOrFail(objectHash: string): Promise<ChronoObject>
    save(object: ChronoObject): Promise<{ objectHash: string }>
    copyFrom(repository: IObjectRepository, objectHash: string): Promise<void>
}
