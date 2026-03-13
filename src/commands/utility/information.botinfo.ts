import { Declare, SubCommand, type CommandContext, Embed } from "seyfert";

@Declare({
    name: "botinfo",
    description: "Información sobre el bot"
})
export class BotInfoCommand extends SubCommand {
    async run(context: CommandContext) {
        const embed = new Embed()
            .setTitle("¿Quién soy?")
            .setDescription("Soy el bot oficial de este servidor, creado por HeizenRC con ayuda de los administradores.")
            .addFields([
                { name: "Nombre:", value: "Wilson" },
                { name: "ID:", value: `${context.client.botId}` },
                { name: "Prefix:", value: `$` },
                { name: "Ayudas especiales:", value: ["flacidpankake", "john_gato", "corbacho_77", "noctyfruitt\_", "nombren.t", "tony_r3c", "izan_el_cocotero"].join(", ") },
            ])
            .setColor("Blurple")

        context.write({
            embeds: [embed]
        })
    }
}