import IndexEntry from '../entities/IndexEntry'

export default interface IIndexEntryRepository {
    findAll(): Promise<IndexEntry[]>
    saveAll(entries: IndexEntry[]): Promise<void>
}
