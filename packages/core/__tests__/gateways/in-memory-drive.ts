import DirectoryEntry from "../../entities/directory-entry";
import { Drive } from "../../gateways/drive-manager";

export default class InMemoryDrive implements Drive {
    public files = new Map<string, DirectoryEntry>()

    public config = {}

    public async list(path: string): Promise<DirectoryEntry[]>{
        const all = Array.from(this.files.values())

        return all
    }
}