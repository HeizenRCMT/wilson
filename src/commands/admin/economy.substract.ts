import { Declare, SubCommand, Options, createUserOption, createNumberOption, type CommandContext, Group } from "seyfert";
import Balance from "../../Schema/EconomySchema/Balance.Schema";

const options = {
    cantidad: createNumberOption({
        description: "Cantidad de dinero a quitar",
        required: true,
        min_value: 1
    }),
    usuario: createUserOption({
        description: "Usuario al que quitar dinero",
        required: true,
    })
}

@Declare({
    name: "quitar",
    description: "Quita dinero a un usuario",
})
@Options(options)
@Group("economía")
export class AdminSubstractCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const member = await context.member?.fetchPermissions()
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }
        const { cantidad, usuario } = context.options;
        const userAccount = await Balance.findOne({ userId: usuario.id });
        
        if (!userAccount || (userAccount.hand + userAccount.bank) < cantidad) {
            return context.write({
                content: `⚠️ El usuario **${usuario.username}** no tiene suficiente dinero para quitarle **${cantidad}**.`
            });
        }

        // Subtract from hand first
        if (userAccount.hand >= cantidad) {
            userAccount.hand -= cantidad;
        } else {
            const remaining = cantidad - userAccount.hand;
            userAccount.hand = 0;
            userAccount.bank -= remaining;
        }

        await userAccount.save();

        return context.write({
            content: `✅ Se han quitado **${cantidad.toLocaleString()}** euros a **${usuario.username}**.`
        });
    }

    onMiddlewaresError(context: CommandContext, error: string) {
      context.editOrReply({ content: error })
    }
}
