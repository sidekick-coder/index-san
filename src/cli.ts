import glob from "glob";
import path from "path";
import Command from "./models/Command";

export default class Cli {
    public listCommandFiles() {
        const basePath = path.resolve(__dirname, "commands");

        return glob.sync(path.resolve(basePath, "**", "*.ts")).map((f) => ({
            filename: f,
            name: f.replace(`${basePath}/`, "").replace(/\.ts$/, "").split("/"),
        }));
    }

    public async find(args: string[]) {
        const [name, action] = args;

        const files = this.listCommandFiles();

        let matched = files
            .filter((f) => f.name.length === 2)
            .find((f) => f.name[0] === name && f.name[1] === action);

        if (!matched) {
            matched = files.find((f) => f.name[0] === name);
        }

        if (!matched) {
            return null;
        }

        const options = (await import(matched.filename)).default;

        const command = new Command();

        command.name = matched.name[1] || matched.name[0];
        command.parent = matched.name[0];
        command.options = options;

        return command;
    }
}
