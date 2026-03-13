"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserInventorySchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true },
    items: [{
            itemId: { type: String, required: true },
            customName: { type: String },
            customDescription: { type: String },
            acquiredAt: { type: Date, default: Date.now }
        }]
});
const UserInventory = (0, mongoose_1.model)("UserInventory", UserInventorySchema);
exports.default = UserInventory;
