import directoryEntry from "../../entities/directory-entry";
import Item from "../../entities/item";
import item from "../../entities/item";
import { Crud } from "../../gateways/crud-manager";
import { Drive } from "../../gateways/drive-manager";

export default class InMemoryCrud implements Crud {
    public drive: Drive

    public async list(entry: directoryEntry): Promise<item[]> {
        const entries = await this.drive.list(entry.path)

        const items = entries
            .filter(e => e.type === 'directory')
            .map(e => new Item({
                id: e.path,
            }))

        return items
    }
}