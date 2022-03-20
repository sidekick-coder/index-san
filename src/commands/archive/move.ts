import Directory from "@/models/Directory";
import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "move-file",
    description: "Move a file from archive source to target",
    async execute({ args, prisma }) {
        const name = args[0];
        const filename = args[1];

        const archive = await prisma.archive.findFirst({
            where: { name },
        });

        if (!archive) {
            throw new Error("Archive not found");
        }

        const source = new Directory(archive.source);
        const target = new Directory(archive.target);

        await source.move(filename, target);

        console.log("File moved successfully");
    },
});
