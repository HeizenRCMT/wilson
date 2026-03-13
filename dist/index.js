"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seyfert_1 = require("seyfert");
const setup_middleware_1 = require("./middlewares/setup.middleware");
require("dotenv/config");
const cooldown_1 = require("@slipher/cooldown");
const mongoose_1 = __importDefault(require("mongoose"));
const client = new seyfert_1.Client({
    commands: {
        prefix: () => ["$"],
        reply: () => true
    },
});
client.setServices({
    middlewares: setup_middleware_1.middlewares,
});
client.start().then(async () => {
    client.cooldown = new cooldown_1.CooldownManager(client);
    await client.uploadCommands().catch(error => console.log(error));
});
mongoose_1.default.connect(process.env.MONGO_URL ?? '').catch(error => console.log(error))
    .then(() => console.log('MongoDB connected'));
process.on('unhandledRejection', async (err) => {
    console.error(err);
});
