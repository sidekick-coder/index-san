import HeadEntry from '../entities/HeadEntry'

export default interface IHeadEntryRepository {
    findAll(): Promise<HeadEntry[]>
}
