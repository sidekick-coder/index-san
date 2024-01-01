import ChronoObject from '../entities/ChronoObject'

export default interface IObjectRepository {
    find(objectHash: string): Promise<ChronoObject | null>
    save(object: ChronoObject): Promise<{ objectHash: string }>
}
