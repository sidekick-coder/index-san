import { Command } from "../types";
import figlet from "figlet";

const command: Command = {
    name: "welcome",
    description: "Welcome to the index-san",
    default: true,
    async execute() {
        console.log(figlet.textSync("index-san"));
    },
};

export default command;
