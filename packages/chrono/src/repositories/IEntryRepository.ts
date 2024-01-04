import ChronoEntry from '../entities/ChronoEntry'

export default interface IEntryRepository {
    findAll(): Promise<ChronoEntry[]>
    saveAll(entries: ChronoEntry[]): Promise<void>
}
