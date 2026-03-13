"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seyfert_1 = require("seyfert");
exports.default = (0, seyfert_1.createEvent)({
    data: { name: 'ready' },
    async run(user, client) {
        client.logger.info(`Bot Online (${user.username})`);
    }
});
