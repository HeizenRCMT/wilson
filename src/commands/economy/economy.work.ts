import { Declare, Middlewares, SubCommand, type CommandContext } from "seyfert";
import { Cooldown, CooldownType } from "@slipher/cooldown";
import Balance from "../../Schema/EconomySchema/Balance.Schema";

@Declare({
  name: "trabajar",
  description: "Consigue dinero trabajando",
})
@Middlewares(["cooldown"])
@Cooldown({
  type: CooldownType.User,
  interval: 1000 * 60,
  uses: {
    default: 2,
  },
})
export class WorkCommand extends SubCommand {
  async run(context: CommandContext) {
    const userAccount = await Balance.findOne({ userId: context.author.id }) || new Balance({
        userId: context.author.id
    });

    const moneyEarned = Math.floor(Math.random() * 100) + 1;
    userAccount.hand += moneyEarned;
    await userAccount.save();

    await context.write({
      content: `Has ganado ${moneyEarned} monedas!`,
    });
  }

  onMiddlewaresError(context: CommandContext, error: string) {
    context.editOrReply({ content: error })
  }
}
