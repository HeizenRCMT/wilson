import { Declare, SubCommand, Embed, type CommandContext } from 'seyfert';
import UserInventory from '../../Schema/EconomySchema/UserInventory.Schema';
import StoreItem from '../../Schema/EconomySchema/StoreItem.Schema';

@Declare({
    name: "ver",
    description: "Mira los objetos que tienes en tu mochila",
})
export class InventoryViewCommand extends SubCommand {
    async run(context: CommandContext) {
        const userId = context.author.id;
        const inventory = await UserInventory.findOne({ userId });

        if (!inventory || inventory.items.length === 0) {
            return context.write({
                content: "Tu inventario está vacío."
            });
        }

        const allStoreItems = await StoreItem.find();
        const storeMap = new Map(allStoreItems.map(i => [i.id, i]));

        const embed = new Embed()
            .setTitle(`Inventario de ${context.author.username}`)
            .setColor("Green")
            .setThumbnail(context.author.avatarURL());

        inventory.items.forEach((item, index) => {
            const original = storeMap.get(item.itemId);
            const name = item.customName || original?.name || "Objeto desconocido";
            const desc = item.customDescription || original?.description || "Sin descripción";
            
            embed.addFields([{
                name: `[${index + 1}] ${name}${item.customName ? ` (${original?.name})` : ""}`,
                value: `📝 ${desc}\n📅 Adquirido: <t:${Math.floor(item.acquiredAt.getTime() / 1000)}:R>`,
                inline: false
            }]);
        });

        await context.write({
            embeds: [embed]
        });
    }
}
