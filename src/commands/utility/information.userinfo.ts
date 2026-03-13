import { Declare, SubCommand, Options, createUserOption, Embed, type CommandContext } from "seyfert";

const options = {
    usuario: createUserOption({
        description: "Usuario del cual quieres información",
        required: false
    })
}

@Declare({
    name: "usuario",
    description: "Te da información de un usuario"
})
@Options(options)
export class UserInfoCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const member = context.options.usuario || context.author;
        
        const embed = new Embed()
            .setTitle("Información de: " + member.username)
            .addFields([
                { name: "Nombre:", value: member.username },
                { name: "ID:", value: member.id },
                { name: "¿Es un bot?", value: member.bot ? "Sí" : "No" },
                { name: "¿Es dueño del servidor?", value: member.id === "1119575096084926505" ? "Sí" : "No" },
                { name: "¿Es dueño del bot?", value: member.id === "709770108863643649" ? "Sí" : "No" },
                { name: "Test", value: `${member.flags?.toString()}` },
                { name: "", value: `` },
            ])
            .setThumbnail(`${member.avatarURL()}`)
            .setDescription("Banner:")
            .setImage(`${member.bannerURL() || "https://static.beebom.com/wp-content/uploads/2022/01/discord-nitro-body.jpg?w=640"}`)
            .setColor("Blurple")

        context.write({
            embeds: [embed]
        })
    }
}