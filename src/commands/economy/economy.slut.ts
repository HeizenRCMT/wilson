import { Declare, SubCommand, type CommandContext, Middlewares } from "seyfert";
import { Cooldown, CooldownType } from "@slipher/cooldown";
import Balance from "../../Schema/EconomySchema/Balance.Schema";

@Declare({
    name: "prostituir",
    description: "Gana dinero follando",
})
@Middlewares(['cooldown'])
@Cooldown({
    type: CooldownType.User,
    interval: (1000 * 60) * 60,
    uses: {
        default: 1,
    }
})
export class SlutCommand extends SubCommand {
    async run(context: CommandContext) {
        const userAccount = await Balance.findOne({ userId: context.author.id }) || new Balance({
            userId: context.author.id
        });
        const members = ["\_heizenrc", "flacidpankake", "corbacho\_77", "noctyfruitt\_", "nombren.t", "tony\_r3c", "\_fabianykeiner\_", "izan\_el\_cocotero", "phewnow\_", "tenqueto13", "ayorc", "john\_gato", "lukax699", "\_gabii\_tm67", "mendez.\_\_", "lamartaa44", "quemimadreque", "rnat.\_\_", "im.nessie"]
        const member = members[Math.floor(Math.random() * members.length)];

        const moneyEarned = Math.floor(Math.random() * 500) + 1;
        userAccount.hand += moneyEarned;

        const messages = [
            `Te has follado a ${member}, este te ha dado ${moneyEarned} eurillos`,
            `${member} te ha pedido un rapidito y tú milagrosamente aceptaste, te han pagado ${moneyEarned}€`,
            `No es ético, ni moral, pero si te mola adelante, total ganaste ${moneyEarned}€`,
            `El sabor no era el mejor, pero ganar plata de ${member} sí, en total unos ${moneyEarned}€`,
            `Tal vez cuando sepas mejor ${member} te pagará mejor, por ahora te dan ${moneyEarned}€`,
            `${moneyEarned}€ y ni tan mal para un callejón sucio, dale las gracias a ${member}`,
            `${member} es muy raro con sus fetiches, pero si de ${member} se saca guita es mejor no pensarlo ||${moneyEarned}€||`,
        ]

        await userAccount.save();
        await context.write({
            content: messages[Math.floor(Math.random() * messages.length)],
        })
    }

    onMiddlewaresError(context: CommandContext, error: string) {
      context.editOrReply({ content: error })
    }
}
