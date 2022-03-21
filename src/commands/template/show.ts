import Directory from "@/models/Directory";
import DirectoryItem from "@/models/DirectoryItem";
import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "Show a template",
    description: "Show template and it's items",
    async execute({ prisma, args }) {
        const name = args[0];

        const template = await prisma.template.findFirst({
            where: { name },
        });

        if (!template) {
            console.log(`Template ${name} not found`);
            return;
        }

        const items = await prisma.templateItems.findMany({
            where: { templateId: template.id },
        });

        Directory.printFiles(
            items.map((i) => new DirectoryItem(i.name, i.isFolder)),
            name
        );
    },
});
