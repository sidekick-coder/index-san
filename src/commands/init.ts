import { defineCommand } from "@/utils/command";
import path from "path";
import fs from "fs";

export default defineCommand({
    name: "Init a new project",
    description: "Create the project structure",
    async execute({ args }) {
        const folderPath = args[0];

        const configFolderPath = path.join(folderPath, ".index-san");

        const exist = await fs.promises
            .stat(configFolderPath)
            .then(() => true)
            .catch(() => false);

        if (exist) {
            throw new Error("The project already was initialized");
        }

        await fs.promises.mkdir(configFolderPath, { recursive: true });

        await fs.promises.writeFile(
            path.join(configFolderPath, "templates.json"),
            JSON.stringify({})
        );
    },
});
