import { Declare, SubCommand, Options, createStringOption, createIntegerOption, createBooleanOption, type CommandContext } from 'seyfert';
import StoreItem from '../../Schema/EconomySchema/StoreItem.Schema';

const options = {
    id: createStringOption({
        description: "ID único del objeto (ej: casco_oro)",
        required: true
    }),
    nombre: createStringOption({
        description: "Nombre visible del objeto",
        required: true
    }),
    descripcion: createStringOption({
        description: "Descripción del objeto",
        required: true
    }),
    precio: createIntegerOption({
        description: "Precio del objeto",
        required: true,
        min_value: 0
    }),
    personalizable: createBooleanOption({
        description: "¿Se puede personalizar este objeto?",
        required: true
    })
};

@Declare({
    name: "añadir",
    description: "Añade un objeto a la tienda (Solo Staff)",
})
@Options(options)
export class StoreAddCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const member = await context.member?.fetchPermissions()
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }
        const { id, nombre, descripcion, precio, personalizable } = context.options;

        const existing = await StoreItem.findOne({ id });
        if (existing) {
            return context.write({
                content: `Ya existe un objeto con el ID \`${id}\`.`
            });
        }

        const newItem = new StoreItem({
            id,
            name: nombre,
            description: descripcion,
            price: precio,
            customizable: personalizable
        });

        await newItem.save();

        await context.write({
            content: `Se ha añadido **${nombre}** a la tienda correctamente.`
        });
    }
}
