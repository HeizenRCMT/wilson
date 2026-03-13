import { Declare, Command, Options } from "seyfert";
import { BotInfoCommand } from "./information.botinfo";
import { UserInfoCommand } from "./information.userinfo";
import { ServerInfoCommand } from "./information.serverinfo";

@Declare({
    name: "utilidades",
    description: "Comandos de utilidad",
})
@Options([BotInfoCommand, UserInfoCommand, ServerInfoCommand])
export default class UtilityParent extends Command {}