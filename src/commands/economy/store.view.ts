import { Declare, SubCommand, Embed, type CommandContext } from 'seyfert';
import StoreItem from '../../Schema/EconomySchema/StoreItem.Schema';

@Declare({
    name: "ver",
    description: "Mira los objetos disponibles en la tienda",
})
export class StoreViewCommand extends SubCommand {
    async run(context: CommandContext) {
        const items = await StoreItem.find();

        if (items.length === 0) {
            return context.write({
                content: "La tienda está vacía por ahora."
            });
        }

        const embed = new Embed()
            .setTitle("🏪 Tienda de Objetos")
            .setDescription("¡Compra objetos y personalízalos si son compatibles!")
            .setColor("Blue");

        items.forEach(item => {
            embed.addFields([{
                name: `${item.name} (ID: \`${item.id}\`)`,
                value: `💰 Precio: **${item.price.toLocaleString()}**\n📝 ${item.description}\n⚙️ Personalizable: ${item.customizable ? "✅" : "❌"}`,
                inline: false
            }]);
        });

        await context.write({
            embeds: [embed]
        });
    }
}
