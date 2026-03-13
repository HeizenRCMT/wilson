// @ts-check
import { GatewayIntentBits } from "seyfert/lib/types/index.js";
import { config } from "seyfert";

export default config.bot({
    token: process.env.BOT_TOKEN ?? '',
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ],
    locations: {
        base: "dist",
        commands: "commands",
        events: "events",
        components: "components"
    }
});