import path from 'path'
import directoryEntry from "../../entities/directory-entry";
import Item from "../../entities/item";
import item from "../../entities/item";
import { Crud } from "../../gateways/crud-manager";
import { Drive } from "../../gateways/drive-manager";

export default class InMemoryCrud implements Crud {
    public drive: Drive

    public async list(collectionPath: string): Promise<item[]> {
        const entries = await this.drive.list(collectionPath)

        const items = entries
            .filter(e => e.type === 'directory')
            .map(e => new Item({}, path.basename(e.path)))

        return items
    }

    public async findById(collectionPath: string, id: string): Promise<Item | null> {
        const all = await this.list(collectionPath)        

        const item = all.find(i => i.id === id)

        return item ?? null
    }
}