import { Declare, SubCommand, Options, createUserOption, type CommandContext, Group } from "seyfert";
import Balance from "../../Schema/EconomySchema/Balance.Schema";

const options = {
    usuario: createUserOption({
        description: "Usuario al que resetear dinero",
        required: true,
    })
}

@Declare({
    name: "quitar-todo",
    description: "Resetea el dinero de un usuario a 0",
})
@Options(options)
@Group("economía")
export class AdminResetCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const member = await context.member?.fetchPermissions()
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }
        const { usuario } = context.options;
        const userAccount = await Balance.findOne({ userId: usuario.id });
        
        if (!userAccount) {
            return context.write({
                content: `El usuario **${usuario.username}** no tiene cuenta todavía.`
            });
        }

        userAccount.hand = 0;
        userAccount.bank = 0;
        await userAccount.save();

        return context.write({
            content: `✅ Se ha reseteado el dinero de **${usuario.username}** a 0.`
        });
    }

    onMiddlewaresError(context: CommandContext, error: string) {
      context.editOrReply({ content: error })
    }
}
