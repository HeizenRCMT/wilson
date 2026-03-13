import { Declare, SubCommand, type CommandContext, createUserOption, Options, Middlewares } from "seyfert";
import { Cooldown, CooldownType } from "@slipher/cooldown";
import Balance from "../../Schema/EconomySchema/Balance.Schema";

const options = {
    víctima: createUserOption({
        description: "Víctima",
        required: true,
    })
}

@Declare({
    name: "robar",
    description: "Roba dinero a alguien",
})
@Middlewares(['cooldown'])
@Cooldown({
    type: CooldownType.User,
    interval: (1000 * 60) * 5,
    uses: {
        default: 1,
    }
})
@Options(options)
export class RobCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const user = context.options.víctima;
        const userAccount = await Balance.findOne({ userId: context.author.id }) || new Balance({
            userId: context.author.id,
        });
        const victimAccount = await Balance.findOne({ userId: user.id }) || new Balance({
            userId: user.id,
        });
        const succesful = Math.random() < 0.5;
        if (victimAccount.hand < 20) {
            context.write({
                content: "La víctima no tiene suficiente dinero para robar"
            })
            return;
        }

        if (succesful) {
            const amount = Math.floor(Math.random() * victimAccount.hand);
            userAccount.hand += amount;
            victimAccount.hand -= amount;
            await userAccount.save();
            await victimAccount.save();
            const messages = [
                `Has robado exitosamente ${amount} euros a ${user.username}`,
                `${user.username} a ido a Barcelona y no ha sido una bonita experiencia, se sentía ligero luego de ir en metro, seguramente porque tú le robaste ${amount}€`,
                `En una pelea en el bar, increíblemente noqueaste a ${user.username} de un puñetazo y le robaste ${amount}€`,
                `Llamaste a ${user.username} y le dijiste que necesitaban su número de tarjeta para gestionar mejor su banco en Microsoft... Perdió ${amount}€`,
                `Ha llegado la hacienda, ${context.author.username} Sánchez le ha robado a ${user.username} un total de ${amount}€`,
                `En el parque de atracciones encontraste una cartera, la de ${user.username}, y tenía dentro ${amount}€`,
            ]
            context.write({
                content: messages[Math.floor(Math.random() * messages.length)]
            })
        } else if (!succesful) {
            const amount = Math.floor(Math.random() * userAccount.hand);
            userAccount.hand -= amount;
            await userAccount.save();
            context.write({
                content: `Fallaste en robar a ${user.username} y perdiste ${amount} monedas`
            })
        }
    }

    onMiddlewaresError(context: CommandContext, error: string) {
      context.editOrReply({ content: error })
    }
}