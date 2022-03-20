import { Command } from "../types";

const command: Command = {
    name: "list-archives",
    description: "List current archives",
    async execute({ prisma }) {
        const archives = await prisma.archive.findMany();

        console.table(archives);
    },
};

export default command;
