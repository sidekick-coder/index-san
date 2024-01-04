export enum ChronoEntryStatus {
    Unmodified = 0,
    Modified = 1,
    Added = 2,
    Deleted = 3,
    Renamed = 4,
    Copied = 5,
}

export default class ChronoEntry {
    public path: string
    public hash: string
    public status: ChronoEntryStatus

    public static STATUS = ChronoEntryStatus

    constructor(
        path: string,
        hash: string,
        status: ChronoEntryStatus = ChronoEntryStatus.Unmodified
    ) {
        this.path = path
        this.hash = hash
        this.status = status
    }

    public static from({ path, hash, status }: Pick<ChronoEntry, 'path' | 'hash' | 'status'>) {
        return new ChronoEntry(path, hash, status)
    }
}
