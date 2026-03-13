import { Declare, SubCommand, Options, createStringOption, type CommandContext } from 'seyfert';
import StoreItem from '../../Schema/EconomySchema/StoreItem.Schema';

const options = {
    id: createStringOption({
        description: "ID del objeto a eliminar",
        required: true
    })
};

@Declare({
    name: "quitar",
    description: "Elimina un objeto de la tienda (Solo Staff)",
})
@Options(options)
export class StoreRemoveCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const member = await context.member?.fetchPermissions()
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }
        const { id } = context.options;

        const deleted = await StoreItem.findOneAndDelete({ id });

        if (!deleted) {
            return context.write({
                content: `No se encontró ningún objeto con el ID \`${id}\`.`
            });
        }

        await context.write({
            content: `Se ha eliminado el objeto **${deleted.name}** de la tienda.`
        });
    }
}
