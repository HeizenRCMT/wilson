"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seyfert_1 = require("seyfert");
exports.default = (0, seyfert_1.createEvent)({
    data: { name: "messageCreate" },
    async run(message) {
        if (message.author.bot)
            return;
        const content = message.content.toLowerCase();
        if (content.includes("pene") || content.includes("verga") || content.includes("pito") || content.includes("polla")) {
            message.reply({
                content: "comes"
            });
        }
    }
});
