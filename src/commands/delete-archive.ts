import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "delete-archive",
    description: "Delete a archive by id",
    async execute({ prisma, args }) {
        const archive = await prisma.archive.findFirst({
            where: {
                id: Number(args[0]),
            },
        });

        if (!archive) {
            console.log("Archive not found");
            return;
        }

        await prisma.archive.delete({
            where: {
                id: Number(args[0]),
            },
        });

        console.log("Archive deleted");
    },
});
