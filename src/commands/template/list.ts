import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "List templates",
    description: "List registered templates",
    async execute({ prisma }) {
        const templates = await prisma.template.findMany();

        console.table(templates);
    },
});
