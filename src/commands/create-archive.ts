import { Command } from "../types";
import fs from "fs";
import path from "path";

async function folderExist(filename: string) {
    return fs.promises
        .access(filename)
        .then(() => true)
        .catch(() => false);
}

const command: Command = {
    name: "create-archive",
    description: "Create a new archives",
    async execute({ prisma, args }) {
        const source = path.resolve(args[0]);
        const target = path.resolve(args[1]);

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
};

export default command;
