import Directory from "@/models/Directory";
import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "restore-file",
    description: "Move a file from archive target to source",
    async execute({ args, prisma }) {
        const filename = args[1];
        const name = args[0];

        const archive = await prisma.archive.findFirst({
            where: { name },
        });

        if (!archive) {
            throw new Error("Archive not found");
        }

        const source = new Directory(archive.source);
        const target = new Directory(archive.target);

        await target.move(filename, source);

        console.log("File moved successfully");
    },
});
