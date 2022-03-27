import { PrismaClient } from "prisma/client";
import { Prompt } from "@poppinss/prompts";

export interface CommandExecArgs {
    prisma: PrismaClient;
    args: string[];
    prompt: Prompt;
}

export interface CommandOptions {
    name: string;
    description?: string;
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

        const prompt = new Prompt();

        await this.options
            .execute({
                prisma: prisma,
                args: this.parseArgs(args),
                prompt,
            })
            .finally(() => prisma.$disconnect());
    }
}
