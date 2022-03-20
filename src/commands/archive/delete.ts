import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "delete-archive",
    description: "Delete a archive by id",
    async execute({ prisma, args }) {
        const name = args[0];

        const archive = await prisma.archive.findFirst({
            where: { name },
        });

        if (!archive) {
            console.log("Archive not found");
            return;
        }

        await prisma.archive.delete({
            where: { name },
        });

        console.log("Archive deleted");
    },
});
