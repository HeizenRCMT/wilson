import { Declare, SubCommand, Options, createUserOption, createNumberOption, type CommandContext, Group } from "seyfert";
import Balance from "../../Schema/EconomySchema/Balance.Schema";

const options = {
    cantidad: createNumberOption({
        description: "Cantidad de dinero a establecer",
        required: true,
        min_value: 0
    }),
    usuario: createUserOption({
        description: "Usuario al que establecer dinero",
        required: true,
    })
}

@Declare({
    name: "personalizar",
    description: "Personaliza (establece) el dinero de un usuario",
})
@Options(options)
@Group("economía")
export class AdminSetCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const member = await context.member?.fetchPermissions()
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }
        const { cantidad, usuario } = context.options;
        const userAccount = await Balance.findOne({ userId: usuario.id }) || new Balance({
            userId: usuario.id,
        });
        
        userAccount.hand = cantidad;
        userAccount.bank = 0; // Maybe only hand?
        await userAccount.save();

        return context.write({
            content: `✅ Se ha establecido el dinero de **${usuario.username}** en **${cantidad.toLocaleString()}** euros.`
        });
    }

    onMiddlewaresError(context: CommandContext, error: string) {
      context.editOrReply({ content: error })
    }
}