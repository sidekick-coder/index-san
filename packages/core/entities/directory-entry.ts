export default class DirectoryEntry {
    public name: string
    public path: string
    public type: 'file' | 'directory'

    constructor(props: Omit<DirectoryEntry, 'children'>) {
        Object.assign(this, props)
    }

    public static normalize(...paths: string[]) {
        const result = paths
            .map((p) => p.split('/'))
            .reduce((all, p) => all.concat(p), [])
            .join('/')

        return result
    }

    public static basename(...paths: string[]) {
        const path = this.normalize(...paths)

        return path.split('/').pop() as string
    }

    public static dirname(...paths: string[]) {
        const path = this.normalize(...paths).split('/')

        path.pop()

        return this.normalize(...path)
    }

    public static extname(...paths: string[]) {
        const basename = this.basename(...paths)

        const extname = basename.split('.').pop()

        return extname ?? ''
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

    public static encode(payload: any): Uint8Array {
        const encoder = new TextEncoder()

        if (Array.isArray(payload) || typeof payload === 'object') {
            payload = JSON.stringify(payload, null, 4)
        }

        if (typeof payload === 'number') {
            payload = String(payload)
        }

        if (typeof payload === 'string') {
            payload = encoder.encode(payload)
        }

        return payload as Uint8Array
    }

    public static decode(payload: Uint8Array) {
        const decoder = new TextDecoder()

        return decoder.decode(payload)
    }
}
