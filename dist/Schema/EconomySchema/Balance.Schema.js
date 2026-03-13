"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BalanceSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true },
    hand: { type: Number, default: 100 },
    bank: { type: Number, default: 0 },
});
const Balance = (0, mongoose_1.model)("Balance", BalanceSchema);
exports.default = Balance;
