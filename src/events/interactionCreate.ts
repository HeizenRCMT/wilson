import { createEvent } from "seyfert";

export default createEvent({
    data: { name: "messageCreate" },
    async run(message) {
        if (message.author.bot) return;
        const content = message.content.toLowerCase();
        if (content.includes("pene") || content.includes("verga") || content.includes("pito") || content.includes("polla")) {
            message.reply({
                content: "comes"
            })
        }
    }
})