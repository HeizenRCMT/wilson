import { Declare, SubCommand, Options, createIntegerOption, type CommandContext } from 'seyfert';
import UserInventory from '../../Schema/EconomySchema/UserInventory.Schema';

const options = {
    indice: createIntegerOption({
        description: "El número del objeto que quieres tirar",
        required: true,
        min_value: 1
    })
};

@Declare({
    name: "tirar",
    description: "Tira un objeto de tu inventario para siempre",
})
@Options(options)
export class InventoryRemoveCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const { indice } = context.options;
        const userId = context.author.id;

        const inventory = await UserInventory.findOne({ userId });
        if (!inventory || !inventory.items[indice - 1]) {
            return context.write({
                content: "No se encontró el objeto en tu inventario."
            });
        }

        inventory.items.splice(indice - 1, 1);
        await inventory.save();

        await context.write({
            content: `Has tirado el objeto a la basura. ¡Ya no está en tu inventario!`
        });
    }
}
