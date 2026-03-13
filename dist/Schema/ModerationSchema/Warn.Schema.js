"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WarnSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    reason: { type: String, default: "No especificada" },
    moderatorId: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
const WarnModel = (0, mongoose_1.model)("Warn", WarnSchema);
exports.default = WarnModel;
