import { Declare, SubCommand, Options, createStringOption, type CommandContext } from 'seyfert';
import StoreItem from '../../Schema/EconomySchema/StoreItem.Schema';
import UserInventory from '../../Schema/EconomySchema/UserInventory.Schema';
import Balance from '../../Schema/EconomySchema/Balance.Schema';

const options = {
    id: createStringOption({
        description: "ID del objeto que quieres comprar",
        required: true
    })
};

@Declare({
    name: "comprar",
    description: "Compra un objeto de la tienda",
})
@Options(options)
export class StoreBuyCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const { id } = context.options;
        const userId = context.author.id;

        const item = await StoreItem.findOne({ id });
        if (!item) {
            return context.write({
                content: "Ese objeto no existe en la tienda."
            });
        }

        const userBalance = await Balance.findOne({ userId }) || new Balance({ userId });
        
        // Prefer cleaning from hand, then bank
        const totalMoney = userBalance.hand + userBalance.bank;
        if (totalMoney < item.price) {
            return context.write({
                content: `No tienes suficiente dinero. El objeto cuesta **${item.price.toLocaleString()}** y tú tienes **${totalMoney.toLocaleString()}**.`
            });
        }

        // Deduct price
        if (userBalance.hand >= item.price) {
            userBalance.hand -= item.price;
        } else {
            const remaining = item.price - userBalance.hand;
            userBalance.hand = 0;
            userBalance.bank -= remaining;
        }

        await userBalance.save();

        // Add to inventory
        let inventory = await UserInventory.findOne({ userId });
        if (!inventory) {
            inventory = new UserInventory({ userId, items: [] });
        }

        inventory.items.push({
            itemId: item.id,
            acquiredAt: new Date()
        });

        await inventory.save();

        await context.write({
            content: `Has comprado **${item.name}** por **${item.price.toLocaleString()}**. ¡Disfrútalo!`
        });
    }
}
