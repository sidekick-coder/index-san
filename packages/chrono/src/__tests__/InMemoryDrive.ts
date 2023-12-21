import IDrive from "../gateways/IDrive";

interface InMemoryEntry {
    type: 'file' | 'directory'
    content?: Uint8Array
    path: string
}

export default class InMemoryDrive implements IDrive {

    public entries: InMemoryEntry[] = []

    public resolve(...args: string[]) {
        return args.join('/')
    }

    public clear() {
        this.entries = []
    }

    public async exists(path: string): Promise<boolean> {
        return !!this.entries.find(entry => entry.path === path)
    }

    public async read(path: string): Promise<Uint8Array | null> {
        const entry = this.entries.find(entry => entry.path === path)

        if (!entry) {
            return null
        }

        return entry.content || null
    }

    public async write(path: string, content: Uint8Array): Promise<void> {
        const entry = this.entries.find(entry => entry.path === path)

        if (entry) {
            entry.content = content
            return
        }
        
        this.entries.push({
            type: 'file',
            path,
            content
        })
    }

    public async mkdir(path: string): Promise<void> {
        this.entries.push({
            type: 'directory',
            path
        })
    }

}