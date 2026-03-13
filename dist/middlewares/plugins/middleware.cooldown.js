"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seyfert_1 = require("seyfert");
const common_1 = require("seyfert/lib/common");
exports.default = (0, seyfert_1.createMiddleware)(async ({ context, next, stop }) => {
    const inCooldown = context.client.cooldown.context(context);
    typeof inCooldown === 'number'
        ? stop(`Tienes que esperar: ${seyfert_1.Formatter.timestamp(new Date(Date.now() + inCooldown), common_1.TimestampStyle.RelativeTime)} espera un poco para hacerlo nuevamente.`)
        : next();
});
