import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "List templates",
    description: "List registered templates",
    async execute({ prisma, prompt }) {
        const templates = await prisma.template.findMany();

        if (templates.length === 0) {
            console.log("No templates found");
            return;
        }

        const templateName = await prompt.choice(
            "Chose the template",
            templates.map((t) => t.name)
        );

        const name = await prompt.ask("File/folder name:");
        const isFolder = await prompt.confirm("Is it a folder?");
        let content = "";

        if (!isFolder) {
            content = await prompt.ask("File content:");
        }

        const templateId = templates.find((t) => t.name === templateName)?.id;

        await prisma.templateItems.create({
            data: {
                templateId: templateId as number,
                name,
                isFolder,
                value: content,
            },
        });

        console.log("Template item created successfully");
    },
});
