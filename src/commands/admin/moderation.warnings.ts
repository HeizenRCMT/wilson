import { Declare, SubCommand, type CommandContext, Group, Options, createUserOption, Embed, ActionRow, Button } from "seyfert";
import { ButtonStyle } from "seyfert/lib/types";
import WarnModel from "../../Schema/ModerationSchema/Warn.Schema";

const options = {
    usuario: createUserOption({
        description: "Usuario del que quieres ver las advertencias",
        required: true,
    })
}

@Declare({
    name: "advertencias",
    description: "Ve las advertencias de un usuario",
})
@Options(options)
@Group("moderación")
export class ModerationWarningsCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const { usuario } = context.options;

        const warnings = await WarnModel.find({
            userId: usuario.id,
            guildId: context.guildId,
        });

        if (!warnings.length) {
            return context.write({
                content: `El usuario \`${usuario.username}\` no tiene advertencias.`,
            });
        }

        const PAGE_SIZE = 1;
        const maxPages = Math.ceil(warnings.length / PAGE_SIZE);
        const currentPage = 0;

        const currentWarnings = warnings.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

        const warnList = currentWarnings.map((warn, index) => {
            const actualIndex = currentPage * PAGE_SIZE + index + 1;
            return `**${actualIndex}.** ID: \`${warn._id}\` - Razón: ${warn.reason} - Moderador: <@${warn.moderatorId}> - ${warn.date.toLocaleDateString()}`;
        }).join("\n");

        const embed = new Embed()
            .setTitle(`Advertencias de ${usuario.username} (${warnings.length})`)
            .setDescription(warnList)
            .setFooter({ text: `Página ${currentPage + 1} de ${maxPages}` })
            .setColor("Yellow");

        const row = new ActionRow<Button>().addComponents(
            new Button()
                .setCustomId(`warnpag_prev_${usuario.id}_${currentPage}`)
                .setLabel("⬅️ Anterior")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 0),
            new Button()
                .setCustomId(`warnpag_next_${usuario.id}_${currentPage}`)
                .setLabel("Siguiente ➡️")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage >= maxPages - 1)
        );

        await context.write({
            embeds: [embed],
            components: [row]
        });
    }
}
