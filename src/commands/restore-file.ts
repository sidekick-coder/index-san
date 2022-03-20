import Directory from "@/models/Directory";
import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "restore-file",
    description: "Move a file from archive target to source",
    async execute({ args, prisma }) {
        const id = Number(args[0]);
        const filename = args[1];

        const archive = await prisma.archive.findFirst({
            where: { id },
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
