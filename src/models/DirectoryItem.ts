export default class DirectoryItem {
    public name: string;
    public isFolder: boolean;
    public icon: string;

    constructor(name: string, isFolder: boolean) {
        this.name = name;
        this.isFolder = isFolder;
        this.icon = this.isFolder ? "📁" : "📄";
    }
}
