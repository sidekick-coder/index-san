export enum IndexEntryStatus {
    Unmodified = 0,
    Modified = 1,
    Added = 2,
    Deleted = 3,
    Renamed = 4,
    Copied = 5,
}

export default class IndexEntry {
    public path: string
    public hash: string
    public status: IndexEntryStatus

    public static STATUS = IndexEntryStatus

    constructor(
        path: string,
        hash: string,
        status: IndexEntryStatus = IndexEntryStatus.Unmodified
    ) {
        this.path = path
        this.hash = hash
        this.status = status
    }

    public static from({ path, hash, status }: Pick<IndexEntry, 'path' | 'hash' | 'status'>) {
        return new IndexEntry(path, hash, status)
    }
}
