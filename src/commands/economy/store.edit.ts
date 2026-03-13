import { Declare, SubCommand, Options, createStringOption, createIntegerOption, createBooleanOption, type CommandContext } from 'seyfert';
import StoreItem from '../../Schema/EconomySchema/StoreItem.Schema';

const options = {
    id: createStringOption({
        description: "ID del objeto que quieres editar",
        required: true
    }),
    nombre: createStringOption({
        description: "Nuevo nombre visible",
        required: false
    }),
    descripcion: createStringOption({
        description: "Nueva descripción",
        required: false
    }),
    precio: createIntegerOption({
        description: "Nuevo precio",
        required: false,
        min_value: 0
    }),
    personalizable: createBooleanOption({
        description: "¿Es personalizable ahora?",
        required: false
    })
};

@Declare({
    name: "editar",
    description: "Edita un objeto existente en la tienda (Solo Staff)",
})
@Options(options)
export class StoreEditCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const member = await context.member?.fetchPermissions()
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }
        const { id, nombre, descripcion, precio, personalizable } = context.options;

        const item = await StoreItem.findOne({ id });
        if (!item) {
            return context.write({
                content: `No se encontró el objeto con ID \`${id}\`.`
            });
        }

        if (nombre) item.name = nombre;
        if (descripcion) item.description = descripcion;
        if (precio !== undefined) item.price = precio;
        if (personalizable !== undefined) item.customizable = personalizable;

        await item.save();

        await context.write({
            content: `Se ha actualizado el objeto **${item.name}** correctamente.`
        });
    }
}
