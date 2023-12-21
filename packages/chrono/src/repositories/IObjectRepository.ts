import ChronoObject from "../entities/ChronoObject"

export default interface IObjectRepository {
    // exists(objectHash: string): Promise<boolean>
    find(objectHash: string): Promise<any>
    save(object: ChronoObject): Promise<{ objectHash: string }>
}