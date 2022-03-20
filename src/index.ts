import Cli from "./cli";

class IndexSan extends Cli {
    public defaultCommand = "welcome";

    public async run(args: string[]) {
        let command = await this.find(args);

        if (!command && args.length === 0) {
            command = await this.find([this.defaultCommand]);
        }

        if (!command) {
            throw new Error("Command not found");
        }

        await command.execute(args);
    }
}

new IndexSan().run(process.argv.slice(2));
