import { Declare, SubCommand, type CommandContext, Group, Options, createStringOption } from "seyfert";
import WarnModel from "../../Schema/ModerationSchema/Warn.Schema";

const options = {
    id: createStringOption({
        description: "ID de la advertencia a eliminar",
        required: true,
    })
}

@Declare({
    name: "quitar-advertencia",
    description: "Elimina una advertencia de un usuario usando su ID",
})
@Options(options)
@Group("moderación")
export class ModerationRemoveWarnCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const member = await context.member?.fetchPermissions()
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }

        const { id } = context.options;

        try {
            const deletedWarn = await WarnModel.findByIdAndDelete(id);

            if (!deletedWarn) {
                return context.write({
                    content: `No se encontró ninguna advertencia con el ID \`${id}\`.`,
                });
            }

            return context.write({
                content: `Advertencia eliminada correctamente.\n**Usuario**: <@${deletedWarn.userId}>\n**Razón**: ${deletedWarn.reason}`,
            });
        } catch (error) {
            return context.write({
                content: `Hubo un error al intentar eliminar la advertencia. Asegúrate de que el ID es válido.`,
            });
        }
    }
}
