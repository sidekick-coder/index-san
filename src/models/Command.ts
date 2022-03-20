import { PrismaClient } from "@prisma/client";

export interface CommandExecArgs {
    prisma: PrismaClient;
    args: string[];
}

export interface CommandOptions {
    name: string;
    description?: string;
    default?: boolean;
    execute: (args: CommandExecArgs) => Promise<void>;
}

export default class Command {
    public parent: string;
    public name: string;
    public options: CommandOptions;

    public parseArgs(args: string[]) {
        return args
            .filter((arg) => arg !== this.parent)
            .filter((arg) => arg !== this.name);
    }

    public async execute(args: string[]) {
        const prisma = new PrismaClient();

        await this.options
            .execute({
                prisma: prisma,
                args: this.parseArgs(args),
            })
            .finally(() => prisma.$disconnect());
    }
}
