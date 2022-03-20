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

    public async move(name: string, directory: Directory) {
        const item = this.items.find((item) => item.name === name);

        if (!item) {
            throw new Error("File not found");
        }

        const oldPath = path.resolve(this.rootPath, name);
        const newPath = path.resolve(directory.rootPath, name);

        return fs.promises
            .rename(oldPath, newPath)
            .then(() => {
                this.refresh();
                directory.refresh();
                return true;
            })
            .catch((err) => {
                console.error(err);
                return false;
            });
    }
}
