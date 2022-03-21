import Directory from "@/models/Directory";
import DirectoryItem from "@/models/DirectoryItem";
import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "Use a template",
    description: "Create template items in the specified  directory",
    async execute({ prisma, args, prompt }) {
        const name = args[0];
        const target = args[1];

        const template = await prisma.template.findUnique({
            where: { name: args[0] },
            include: {
                items: true,
            },
        });

        const targetExist = await Directory.exists(target);

        if (!template) {
            console.log("Template not found");
            return;
        }

        if (!targetExist) {
            console.log("Target folder not found");
            return;
        }

        const root = new Directory(target);

        const folderName = await prompt.ask("Folder name:");

        const directory = await root.mkdir(folderName);

        if (!directory) {
            console.log("Error creating root folder");
            return;
        }

        await Promise.all(
            template.items.map(async (item) => {
                if (item.isFolder) {
                    return await directory.mkdir(item.name);
                }

                return await directory.put(item.name, item.value);
            })
        );

        root.print();
    },
});
