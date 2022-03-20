import glob from "glob";
import path from "path";

import { Command } from "../types";

export function defineCommand(options: Command) {
    return options;
}

export async function findCommand(name?: string) {
    const files = glob.sync(path.resolve(__dirname, "..", "commands", "*"));

    const commands = await Promise.all(
        files.map(async (f) => (await import(f)).default)
    );

    const command: Command = commands.find(
        (c) => c.name === name || (!name && c.default)
    );

    if (!command) {
        throw new Error("Command not found");
    }

    return command;
}
