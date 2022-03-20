import figlet from "figlet";

import { defineCommand } from "@/utils/command";

export default defineCommand({
    name: "welcome",
    description: "Welcome to the index-san",
    default: true,
    async execute() {
        console.log(figlet.textSync("index-san"));
    },
});
