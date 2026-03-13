import { SubCommand, type CommandContext, Declare, Options, createNumberOption } from "seyfert";
import Balance from '../../Schema/EconomySchema/Balance.Schema';

const option = {
    amount: createNumberOption({
        description: "Amount of money to deposit",
        required: false,
    })
}
@Declare({
    name: "depositar",
    description: "Deposita dinero en tu cuenta bancaria",
})
@Options(option)
export class BankDepositCommand extends SubCommand {
    async run(context: CommandContext<typeof option>) {
        const amount = context.options.amount;
        const userAccount = await Balance.findOne({ userId: context.author.id }) || new Balance({
            userId: context.author.id
        });
        if (!amount) {
            userAccount.bank += userAccount.hand;
            userAccount.hand = 0;
            userAccount.save();
            await context.write({
                content: `Depositaste todo tu dinero en tu cuenta bancaria`,
            })
        } else {
            if (userAccount.hand < amount) {
                await context.write({
                    content: "No tienes suficiente dinero para depositar",
                });
                return;
            }
            userAccount.hand -= amount;
            userAccount.bank += amount;
            await userAccount.save();
            await context.write({
                content: `Depositaste ${amount} monedas en tu cuenta bancaria`,
            });
        }
    }
}