import ChronoStageItem from '../entities/ChronoStageItem'

export default interface IStageItemRepository {
    save(item: ChronoStageItem): Promise<void>
    saveAll(items: ChronoStageItem[]): Promise<void>
    findAll(): Promise<ChronoStageItem[]>
    removeByPath(path: string): Promise<void>
}
