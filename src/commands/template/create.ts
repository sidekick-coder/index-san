import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "Create template",
    description: "Create a template of folders and files in the specified path",
    async execute({ prisma, args }) {
        const name = args[0];

        await prisma.template.create({
            data: {
                name,
            },
        });

        console.log("Template create successfully");
    },
});
