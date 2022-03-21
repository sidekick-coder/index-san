import fs from "fs";
import path from "path";
import DirectoryItem from "./DirectoryItem";

export default class Directory {
    public items: DirectoryItem[];

    constructor(public rootPath: string, public name?: string) {
        this.refresh();
    }

    public refresh() {
        const files = fs.readdirSync(this.rootPath, { withFileTypes: true });

        const items = files.map(
            (f) => new DirectoryItem(f.name, f.isDirectory())
        );

        this.items = items;
    }

    public static printFiles(items: DirectoryItem[], rootName?: string) {
        if (rootName) {
            console.log(`📂 ${rootName}`);
        }

        items.forEach((item) => {
            console.log(`> ${item.icon} ${item.name}`);
        });
    }

    public print() {
        Directory.printFiles(this.items, this.name || this.rootPath);
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

    public static async exists(filename: string) {
        return fs.promises
            .access(filename)
            .then(() => true)
            .catch(() => false);
    }

    public async mkdir(name: string) {
        const filename = path.resolve(this.rootPath, name);

        return fs.promises
            .mkdir(filename)
            .then(() => {
                this.refresh();
                return new Directory(filename);
            })
            .catch((err) => {
                console.error(err);
                return null;
            });
    }

    public async put(name: string, data: string) {
        const filename = path.resolve(this.rootPath, name);

        return fs.promises
            .writeFile(filename, data)
            .then(() => {
                this.refresh();
                return new DirectoryItem(name, false);
            })
            .catch((err) => {
                console.error(err);
                return false;
            });
    }
}
