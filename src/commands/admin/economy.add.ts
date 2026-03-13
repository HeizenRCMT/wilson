import { Declare, SubCommand, Options, createUserOption, createNumberOption, type CommandContext, Group } from "seyfert";
import Balance from "../../Schema/EconomySchema/Balance.Schema";

const options = {
    cantidad: createNumberOption({
        description: "Cantidad de dinero a añadir",
        required: true,
        min_value: 1
    }),
    usuario: createUserOption({
        description: "Usuario al que añadir dinero",
        required: true,
    })
}

@Declare({
    name: "añadir",
    description: "Añade dinero a un usuario",
})
@Options(options)
@Group("economía")
export class AdminAddCommand extends SubCommand {
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
        
        userAccount.hand += cantidad;
        await userAccount.save();

        return context.write({
            content: `✅ Se han añadido **${cantidad.toLocaleString()}** euros a la cartera de **${usuario.username}**.`
        });
    }

    onMiddlewaresError(context: CommandContext, error: string) {
      context.editOrReply({ content: error })
    }
}