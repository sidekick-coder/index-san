import { resolve } from "path";
import { CommandOptions } from "./composable/command";
class IndexSan {
    public async run(args: string[]) {
        const commands = new Map();

        let [commandName, ...commandArgs] = args || [];

        commands.set("init", resolve(__dirname, "commands/init.ts"));
        commands.set("welcome", resolve(__dirname, "commands/welcome.ts"));

        if (!commands.has(commandName)) {
            commandName = "welcome";
        }

        const command: CommandOptions = require(commands.get(
            commandName
        )).default;

        await command.execute(commandArgs);
    }
}

new IndexSan().run(process.argv.slice(2));
