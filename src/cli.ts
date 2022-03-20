import glob from "glob";
import path from "path";

export async function cli(args: string[]) {
    const name = args[0];
    const files = glob.sync(path.resolve(__dirname, "commands", "*"));

    const commands = await Promise.all(
        files.map(async (f) => (await import(f)).default)
    );

    const command = commands.find((c) => c.name === name || c.default);

    if (!command) {
        console.log("Command not found");
        return;
    }

    if (command) {
        await command.execute(args.slice(1));
    }
}

cli(process.argv.slice(2));
