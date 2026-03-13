import { Declare, Groups, Options, Command } from "seyfert";
import { AdminAddCommand } from "./economy.add";
import { AdminSetCommand } from "./economy.set";
import { AdminSubstractCommand } from "./economy.substract";
import { AdminResetCommand } from "./economy.reset";
import { ModerationWarnCommand } from "./moderation.warn";
import { ModerationWarningsCommand } from "./moderation.warnings";
import { ModerationRemoveWarnCommand } from "./moderation.removewarn";

@Declare({
    name: "admin",
    description: "Comandos solo para administradores."
})
@Options([
    AdminAddCommand, 
    AdminSetCommand, 
    AdminSubstractCommand, 
    AdminResetCommand,
    ModerationWarnCommand,
    ModerationWarningsCommand,
    ModerationRemoveWarnCommand
])
@Groups({
    "economía": {
        defaultDescription: "Comandos de administrador de economía"
    },
    "moderación": {
        defaultDescription: "Comandos de administrador de moderación"
    }
})
export default class AdminParent extends Command {}