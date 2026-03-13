import { Declare, SubCommand, Options, createIntegerOption, createStringOption, type CommandContext } from 'seyfert';
import UserInventory from '../../Schema/EconomySchema/UserInventory.Schema';
import StoreItem from '../../Schema/EconomySchema/StoreItem.Schema';

const options = {
    indice: createIntegerOption({
        description: "El número del objeto en tu inventario (ej: 1, 2...)",
        required: true,
        min_value: 1
    }),
    nombre: createStringOption({
        description: "Nuevo nombre para el objeto",
        required: false
    }),
    descripcion: createStringOption({
        description: "Nueva descripción para el objeto",
        required: false
    })
};

@Declare({
    name: "personalizar",
    description: "Personaliza un objeto de tu inventario (si es compatible)",
})
@Options(options)
export class InventoryCustomizeCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const { indice, nombre, descripcion } = context.options;
        const userId = context.author.id;

        const inventory = await UserInventory.findOne({ userId });
        if (!inventory || !inventory.items[indice - 1]) {
            return context.write({
                content: "No se encontró el objeto en la posición indicada."
            });
        }

        const itemInInv = inventory.items[indice - 1];
        const originalItem = await StoreItem.findOne({ id: itemInInv.itemId });

        if (!originalItem?.customizable) {
            return context.write({
                content: "Este objeto no se puede personalizar."
            });
        }

        if (nombre) itemInInv.customName = nombre;
        if (descripcion) itemInInv.customDescription = descripcion;

        await inventory.save();

        await context.write({
            content: `Has personalizado el objeto **${originalItem.name}** correctamente.`
        });
    }
}
