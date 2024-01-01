export default class ChronoStageItem {
    public type: string
    public path: string
    public hash: string

    public static from({ type, path, hash }: ChronoStageItem) {
        const item = new ChronoStageItem()

        item.type = type
        item.path = path
        item.hash = hash

        return item
    }
}
