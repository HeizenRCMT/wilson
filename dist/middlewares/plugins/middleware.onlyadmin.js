"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seyfert_1 = require("seyfert");
const types_1 = require("seyfert/lib/types");
exports.default = (0, seyfert_1.createMiddleware)(async (middle) => {
    const member = await middle.context.member?.fetchPermissions();
    if (!member?.has(["Administrator"]) || middle.context.author.id !== "709770108863643649") {
        middle.context.write({
            content: "No eres administrador",
            flags: types_1.MessageFlags.Ephemeral
        });
        return middle.stop("");
    }
    middle.next("");
});
