import { Client, ParseClient, ParseMiddlewares, UsingClient } from "seyfert";
import { middlewares } from "./middlewares/setup.middleware";
import "dotenv/config";
import { CooldownManager } from "@slipher/cooldown";
import mongoose from "mongoose";

const client = new Client({
    commands: {
        prefix: () => ["$"],
        reply: () => true
    },
}) as UsingClient & Client;

client.setServices({
    middlewares: middlewares,
});

client.start().then(async () => {
    client.cooldown = new CooldownManager(client);
    await client.uploadCommands().catch(error => console.log(error));
});

declare module 'seyfert' {
    interface UsingClient extends ParseClient<Client<true>> {
        cooldown: CooldownManager;
    }
    interface RegisteredMiddlewares extends ParseMiddlewares<typeof middlewares> {}
}

mongoose.connect(process.env.MONGO_URL ?? '').catch(error => console.log(error))
.then(() => console.log('MongoDB connected'))

process.on('unhandledRejection', async (err) => {
    console.error(err);
});