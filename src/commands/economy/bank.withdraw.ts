import { SubCommand, type CommandContext, Declare, Options, createNumberOption } from "seyfert";
import Balance from '../../Schema/EconomySchema/Balance.Schema';

const option = {
    amount: createNumberOption({
        description: "Amount of money to withdraw",
        required: false,
    })
}
@Declare({
    name: "retirar",
    description: "Retira dinero de tu cuenta bancaria",
})
@Options(option)
export class BankWithdrawCommand extends SubCommand {
    async run(context: CommandContext<typeof option>) {
        const amount = context.options.amount;
        const userAccount = await Balance.findOne({ userId: context.author.id }) || new Balance({
            userId: context.author.id
        });
        if (!amount) {
            userAccount.hand += userAccount.bank;
            userAccount.bank = 0;
            userAccount.save();
            await context.write({
                content: `Retiraste todo tu dinero de tu cuenta bancaria`,
            })
        } else {
            if (userAccount.bank < amount) {
                await context.write({
                    content: "No tienes suficiente dinero para retirar",
                });
                return;
            }
            userAccount.bank -= amount;
            userAccount.hand += amount;
            await userAccount.save();
            await context.write({
                content: `Retiraste ${amount} monedas de tu cuenta bancaria`,
            });
        }
    }
}