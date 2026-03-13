import { Declare, SubCommand, type CommandContext, Group, Options, createStringOption, createUserOption } from "seyfert";
import WarnModel from "../../Schema/ModerationSchema/Warn.Schema";

const options = {
    usuario: createUserOption({
        description: "Usuario a advertir",
        required: true,
    }),
    razón: createStringOption({
        description: "Razón de la advertencia",
        required: false,
    })
}

@Declare({
    name: "advertir",
    description: "Advierte a un usuario",
})
@Options(options)
@Group("moderación")
export class ModerationWarnCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const member = await context.member?.fetchPermissions()
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }

        const { usuario, razón } = context.options;

        const newWarn = new WarnModel({
            userId: usuario.id,
            guildId: context.guildId,
            reason: razón || "No especificada",
            moderatorId: context.author.id,
        });

        await newWarn.save();

        await context.write({
            content: `El usuario \`${usuario.username}\` ha sido advertido por: ${razón || "No especificada"}`,
        });
    }
}
