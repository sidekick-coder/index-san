import { defineCommand } from "@/utils/command";
import Directory from "@/models/Directory";

export default defineCommand({
    name: "list-files",
    description: "List files of archive",
    async execute({ prisma, args }) {
        const name = args[0];
        const type = args[1];

        const archive = await prisma.archive.findFirst({
            where: { name },
        });

        if (!archive) {
            throw new Error("Archive not found");
        }

        const directory = new Directory(
            type === "target" ? archive.target : archive.source
        );

        directory.print();
    },
});
