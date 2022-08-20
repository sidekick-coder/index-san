export default class DirectoryEntry {
    public name: string
    public path: string
    public type: 'file' | 'directory'
    public children: DirectoryEntry[] = []

    constructor(props: Omit<DirectoryEntry, 'children'>) {
        Object.assign(this, props)
    }
}