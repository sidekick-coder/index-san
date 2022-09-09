export default class DirectoryEntry {
    public name: string
    public path: string
    public type: 'file' | 'directory'

    constructor(props: Omit<DirectoryEntry, 'children'>) {
        Object.assign(this, props)
    }

    public static directory(path: string) {
        const basename = path.split('/').pop()

        return new DirectoryEntry({
            name: basename as string,
            path,
            type: 'directory',
        })
    }

    public static file(path: string) {
        const basename = path.split('/').pop()

        return new DirectoryEntry({
            name: basename as string,
            path,
            type: 'file',
        })
    }
}