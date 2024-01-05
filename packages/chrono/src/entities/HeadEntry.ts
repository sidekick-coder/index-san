export default class HeadEntry {
    public path: string
    public hash: string
    public type: 'blob' | 'tree' = 'blob'

    public static from(payload: Pick<HeadEntry, 'path' | 'hash' | 'type'>) {
        const head = new HeadEntry()

        Object.assign(head, payload)

        return head
    }
}
