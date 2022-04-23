import figlet from "figlet";
import { defineCommand } from "@/composable/command";

export default defineCommand({
    name: "welcome",
    description: "Welcome to the index-san",
    async execute() {
        console.log(figlet.textSync("index-san"));
    },
});
