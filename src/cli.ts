import glob from "glob";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { Command } from "./types";

export async function cli(args: string[]) {
    const name = args[0];
    const files = glob.sync(path.resolve(__dirname, "commands", "*"));

    const commands = await Promise.all(
        files.map(async (f) => (await import(f)).default)
    );

    const command: Command = commands.find(
        (c) => c.name === name || (!name && c.default)
    );

    if (!command) {
        console.log("Command not found");
        return;
    }

    const prisma = new PrismaClient();

    await command
        .execute({ prisma, args: args.slice(1) })
        .catch((e) => console.error(e))
        .finally(() => prisma.$disconnect());
}

cli(process.argv.slice(2));
