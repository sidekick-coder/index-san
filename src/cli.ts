import { PrismaClient } from "@prisma/client";
import { findCommand } from "./utils/command";

export async function cli(args: string[]) {
    const name = args[0];

    const command = await findCommand(name);

    const prisma = new PrismaClient();

    await command
        .execute({ prisma, args: args.slice(1) })
        .catch((e) => console.error(e))
        .finally(() => prisma.$disconnect());
}

cli(process.argv.slice(2));
