export interface CommandOptions {
    name: string;
    description?: string;
    execute: (args: string[]) => Promise<void>;
}

export function defineCommand(options: CommandOptions) {
    return options;
}
