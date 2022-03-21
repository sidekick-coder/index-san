import path from "path";
import Directory from "@/models/Directory";
import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "File to template",
    description: "Get a file and convert it to a template",
    async execute({ args, prisma, prompt }) {
        const filename = args[0];

        const exists = await Directory.exists(filename);

        if (!exists) {
            throw new Error("File not found");
        }

        const file = path.basename(filename);

        const target = new Directory(path.dirname(filename));

        const templates = await prisma.template.findMany({
            include: { items: true },
        });

        const selected = await prompt.choice(
            "Select a template",
            templates.map((t) => t.name)
        );

        const folderName = await prompt.ask("Type a folder name: ");

        const template = templates.find((t) => t.name === selected);

        const items = template?.items || [];

        const wherePutFile = await prompt.choice("Where to put the file", [
            "root",
            ...items.filter((i) => i.isFolder).map((i) => i.name),
        ]);

        console.log("Creating folder and items....");

        const root = await target.mkdir(folderName);

        if (!root) {
            throw new Error("Could not create root folder");
        }

        if (wherePutFile === "root") {
            await target.move(file, root);
        }

        await Promise.all(
            items.map(async (item) => {
                if (!item.isFolder) {
                    return await root.put(item.name, item.value);
                }

                const folder = await root.mkdir(item.name);

                if (folder && wherePutFile === item.name) {
                    await target.move(file, folder);
                }
            })
        );

        console.log("File to template completed");

        target.print();
    },
});
