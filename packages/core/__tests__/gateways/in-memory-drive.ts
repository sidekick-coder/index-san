import DirectoryEntry from "../../entities/directory-entry";
import { Drive } from "../../gateways/drive-manager";

export default class InMemoryDrive implements Drive {
    public entries: DirectoryEntry[] = []
    public content = new Map<string, Buffer>()

    public config = {}

    public async list(path: string): Promise<DirectoryEntry[]>{
        return this.entries
    }

    public write(entry: DirectoryEntry, content?: Buffer): Promise<DirectoryEntry>{
        this.entries.push(entry)

        if (entry.type === 'file') {
            this.content.set(entry.path, content || Buffer.from(''))
        }

        return Promise.resolve(entry)
    }
}