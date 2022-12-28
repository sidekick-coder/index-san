import DirectoryEntry from '../../entities/directory-entry'
import Drive from '../../gateways/drive/drive'
import DriveHelper from '../../gateways/drive/helper'

export default class InMemoryDrive implements Drive {
    public entries: DirectoryEntry[] = []
    public content = new Map<string, Uint8Array>()

    constructor(public config: any = {}) {}

    public clear() {
        this.entries = []
        this.content.clear()
    }

    public async list(path: string): Promise<DirectoryEntry[]> {
        if (path === '/') {
            return this.entries.filter((e) => !e.path.includes('/'))
        }

        return this.entries.filter((e) => [path, e.name].join('/') === e.path)
    }

    public async get(path: string) {
        const entry = this.entries.find((e) => e.path === path)

        return entry ?? null
    }

    public async exists(path: string) {
        const entry = this.entries.find((e) => e.path === path)

        return !!entry
    }

    public async move(source: string, target: string) {
        const entry = this.entries.find((e) => e.path === source)

        if (!entry) return

        entry.name = DirectoryEntry.basename(target)

        entry.path = target
    }

    public async read(path: string) {
        return this.content.get(path) ?? null
    }

    public async readArray(path: string): Promise<any[]> {
        const content = await this.read(path)

        return content ? DriveHelper.toArray(content) : []
    }

    public async write(path: string, content: Uint8Array) {
        this.content.set(DirectoryEntry.normalize(path), content)

        if (!this.entries.some((e) => e.path === path)) {
            this.entries.push(DirectoryEntry.file(path))
        }
    }

    public async mkdir(path: string) {
        const entry = DirectoryEntry.directory(path)

        if (!this.entries.some((e) => e.path === path)) {
            this.entries.push(entry)
        }

        return entry
    }

    public async delete(path: string) {
        const index = this.entries.findIndex((e) => e.path === path)

        if (index === -1) return

        this.content.delete(path)

        this.entries.splice(index, 1)
    }

    public createFile(path: string, content: any = '') {
        const entry = DirectoryEntry.file(path)

        if (!this.entries.some((e) => e.path === path)) {
            this.entries.push(entry)
        }

        this.content.set(entry.path, DriveHelper.encode(content))
    }

    public createDir(...entryPath: string[]) {
        const entry = DirectoryEntry.directory(entryPath.join('/'))

        this.entries.push(entry)

        return entry
    }
}
