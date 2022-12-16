export default class DirectoryEntry {
    public name: string
    public path: string
    public type: 'file' | 'directory'

    constructor(props: Omit<DirectoryEntry, 'children'>) {
        Object.assign(this, props)
    }

    public static normalize(...paths: string[]) {
        let result = paths
            .map((p) => p.split('/'))
            .reduce((all, p) => all.concat(p), [])
            .join('/')

        if (result[0] === '/') {
            result = result.slice(1)
        }

        return result
    }

    public static basename(...paths: string[]) {
        const path = this.normalize(...paths)

        return path.split('/').pop() as string
    }

    public static extname(...paths: string[]) {
        const basename = this.basename(...paths)

        const [, extname] = basename.split('.')

        return extname
    }

    public static directory(...paths: string[]) {
        const path = this.normalize(...paths)

        const basename = this.basename(...paths)

        return new DirectoryEntry({
            name: basename as string,
            path,
            type: 'directory',
        })
    }

    public static file(...paths: string[]) {
        const path = this.normalize(...paths)

        const basename = path.split('/').pop()

        return new DirectoryEntry({
            name: basename as string,
            path,
            type: 'file',
        })
    }
}
