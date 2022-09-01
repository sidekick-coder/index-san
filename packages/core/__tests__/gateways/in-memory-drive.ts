import DirectoryEntry from "../../entities/directory-entry";
import { Drive } from "../../gateways/drive-manager";

export default class InMemoryDrive implements Drive {
    public entries: DirectoryEntry[] = []
    public content = new Map<string, Buffer>()

    public config = {}

    public clear(){
        this.entries = []
        this.content.clear()
    }

    public async list(path: string): Promise<DirectoryEntry[]>{
        return this.entries
    }

    public create(entry: DirectoryEntry, content?: Buffer): Promise<DirectoryEntry>{
        this.entries.push(entry)

        if (entry.type === 'file') {
            this.content.set(entry.path, content || Buffer.from(''))
        }

        return Promise.resolve(entry)
    }
    
    public createSync(entry: DirectoryEntry, content?: Buffer): DirectoryEntry{
        this.entries.push(entry)

        if (entry.type === 'file') {
            this.content.set(entry.path, content || Buffer.from(''))
        }

        return entry
    }
    
    public async update(path: string, newPath: string, newContent?: Buffer): Promise<void> {
        const index= this.entries.findIndex(e => e.path === path)

        if (index === -1) return

        const oldContent = this.content.get(path) ?? Buffer.from('')

        this.entries[index].path = newPath

        this.content.delete(path)

        this.content.set(newPath, newContent || oldContent)
    }

    public async get(path: string) {
        const entry = this.entries.find(e => e.path === path)

        return entry ?? null
    }

    public async exists (path: string) {
        const entry = this.entries.find(e => e.path === path)

        return !!entry
    }
    
    public async delete (path: string) {

        const index = this.entries.findIndex(e => e.path === path)

        if (index === -1) return

        this.content.delete(path)

        this.entries.splice(index, 1)
    }
    
    public async read (path: string) {
        return this.content.get(path) ?? null
    }
}