import { PrismaClient } from "@prisma/client";

export interface CommandExecArgs {
    prisma: PrismaClient;
    args: string[];
}

export interface Command {
    name: string;
    description?: string;
    default?: boolean;
    execute: (args: CommandExecArgs) => Promise<void>;
}
