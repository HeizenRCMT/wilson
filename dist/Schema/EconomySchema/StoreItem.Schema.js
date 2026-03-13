"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StoreSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    customizable: { type: Boolean, default: false },
});
const StoreItem = (0, mongoose_1.model)("StoreItem", StoreSchema);
exports.default = StoreItem;
