import fs from "fs";
import path from "path";

import { defineCommand } from "@/utils/command";

async function folderExist(filename: string) {
    return fs.promises
        .access(filename)
        .then(() => true)
        .catch(() => false);
}

export default defineCommand({
    name: "create-archive",
    description: "Create a new archives",
    async execute({ prisma, args }) {
        const name = args[0];
        const source = path.resolve(args[1]);
        const target = path.resolve(args[2]);

        const sourceExist = await folderExist(source);
        const targetExist = await folderExist(target);

        if (!sourceExist) {
            console.log("Source folder not found");
            return;
        }

        if (!targetExist) {
            console.log("Target folder not found");
            return;
        }

        const archive = await prisma.archive.create({
            data: {
                name,
                source: source,
                target: target,
            },
        });

        console.table([
            ["id", archive.id],
            ["source", archive.source],
            ["target", archive.target],
        ]);
    },
});
