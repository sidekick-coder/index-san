import DirectoryEntry from '../../entities/directory-entry'
import { Drive } from '../../gateways/drive-manager'

export default class InMemoryDrive implements Drive {
    public entries: DirectoryEntry[] = []
    public content = new Map<string, Buffer>()
    
    public config = {}

    public clear(){
        this.entries = []
        this.content.clear()
    }

    public async list(): Promise<DirectoryEntry[]>{
        return this.entries
    }   
    

    public async get(path: string) {
        const entry = this.entries.find(e => e.path === path)

        return entry ?? null
    }

    public async exists (path: string) {
        const entry = this.entries.find(e => e.path === path)

        return !!entry
    }
    
    public async move (source: string, target: string) {
        const entry = this.entries.find(e => e.path === source)

        if (!entry) return

        entry.path = target
    }

    public async read (path: string) {
        return this.content.get(path) ?? null
    }

    public async write(path: string, content: Buffer) {
        this.content.set(path, content)

        this.entries.push(DirectoryEntry.file(path))
    }

    public async mkdir(entryPath: string){
        const entry = DirectoryEntry.directory(entryPath)
        
        this.entries.push(entry)

        return entry
    }
    
    public async delete (path: string) {

        const index = this.entries.findIndex(e => e.path === path)

        if (index === -1) return

        this.content.delete(path)

        this.entries.splice(index, 1)
    }


    public createFile(entryPath: string, content: any = '') {
        const entry = DirectoryEntry.file(entryPath)

        if (Array.isArray(content)) {
            content = JSON.stringify(content)
        }

        if (typeof content === 'object') {
            content = JSON.stringify(content)
        }

        this.entries.push(entry)
        this.content.set(entryPath, Buffer.from(content))
    }
    
}