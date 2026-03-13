import { Declare, SubCommand, Embed, Options, type CommandContext, createUserOption } from 'seyfert';
import Balance from '../../Schema/EconomySchema/Balance.Schema';

const options = {
    usuario: createUserOption({
        description: "El usuario a consultar",
        required: false
    })
}

@Declare({
    name: "cartera",
    description: "Mira tu dinero",
})
@Options(options)
export class BalanceCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const user = context.options.usuario || context.author;
        
        const userAccount = await Balance.findOne({ userId: user.id }) || new Balance({
            userId: user.id
        });
        userAccount.save();
        
        const bank = userAccount?.bank.toLocaleString();
        const hand = userAccount?.hand.toLocaleString();
        const totalBalance = Number(bank) + Number(hand);
        const balanceEmbed = new Embed()
            .setTitle(`Dinero de ${user.username}`)
            .addFields([
                { name: "En mano", value: `${hand}`, inline: true },
                { name: "En el banco", value: `${bank}`, inline: true },
                { name: "Total", value: `${totalBalance.toLocaleString()}`, inline: true },
            ])
            .setColor("Random");

        await context.write({
            embeds: [balanceEmbed]
        });
    }
}