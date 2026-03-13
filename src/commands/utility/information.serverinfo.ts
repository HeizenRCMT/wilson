import { Declare, SubCommand, type CommandContext, Embed } from "seyfert";

@Declare({
    name: "servidor",
    description: "Información sobre el servidor"
})
export class ServerInfoCommand extends SubCommand {
    async run(context: CommandContext) {
        const guild = await context.guild()
        const embed = new Embed()
            .setTitle("Información del servidor")
            .addFields([
                { name: "Nombre:", value: `${guild?.name}`},
                { name: "ID:", value: `${context.guildId}`},
                { name: "Dueño:", value: `${guild?.owner}`},
                { name: "Miembros:", value: `${guild?.memberCount}`},
                { name: "Creado en:", value: `${guild?.createdAt}`},
                { name: "", value: `` },
            ])
            .setThumbnail(`${guild?.iconURL()}`)
            .setColor("Blurple")

        context.write({
            embeds: [embed]
        })
    }
}