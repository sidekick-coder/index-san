import fs from "fs";
import path from "path";
import DirectoryItem from "./DirectoryItem";

export default class Directory {
    public items: DirectoryItem[];

    constructor(public rootPath: string) {
        this.refresh();
    }

    public refresh() {
        const files = fs.readdirSync(this.rootPath, { withFileTypes: true });

        const items = files.map(
            (f) => new DirectoryItem(f.name, f.isDirectory())
        );

        this.items = items;
    }

    public print() {
        this.items.forEach((item) => console.log(`${item.icon} ${item.name}`));
    }
}
