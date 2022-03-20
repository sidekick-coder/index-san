import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "list-archives",
    description: "List current archives",
    async execute({ prisma }) {
        const archives = await prisma.archive.findMany();

        console.table(archives);
    },
});
