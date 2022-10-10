export default class DirectoryEntry {
    public name: string
    public path: string
    public type: 'file' | 'directory'

    constructor(props: Omit<DirectoryEntry, 'children'>) {
        Object.assign(this, props)
    }

    public static directory(...paths: string[]) {
        const path = paths
            .map(p => p.split('/'))
            .reduce((all, p) => all.concat(p), [])
            .join('/')

        const basename = path.split('/').pop()

        return new DirectoryEntry({
            name: basename as string,
            path,
            type: 'directory',
        })
    }

    public static file(...paths: string[]) {
        const path = paths
            .map(p => p.split('/'))
            .reduce((all, p) => all.concat(p), [])
            .join('/')

        const basename = path.split('/').pop()

        return new DirectoryEntry({
            name: basename as string,
            path,
            type: 'file',
        })
    }
}