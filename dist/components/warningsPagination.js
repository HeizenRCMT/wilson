"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seyfert_1 = require("seyfert");
const types_1 = require("seyfert/lib/types");
const Warn_Schema_1 = __importDefault(require("../Schema/ModerationSchema/Warn.Schema"));
class WarningsPagination extends seyfert_1.ComponentCommand {
    componentType = "Button";
    filter(context) {
        return context.customId.startsWith("warnpag_");
    }
    async run(context) {
        const [, action, userId, pageStr] = context.customId.split("_");
        let currentPage = parseInt(pageStr);
        if (action === "prev") {
            currentPage--;
        }
        else if (action === "next") {
            currentPage++;
        }
        const warnings = await Warn_Schema_1.default.find({
            userId: userId,
            guildId: context.guildId,
        });
        if (!warnings.length) {
            return context.write({
                content: "El usuario ya no tiene advertencias.",
                flags: 64 // Ephemeral
            });
        }
        const PAGE_SIZE = 1;
        const maxPages = Math.ceil(warnings.length / PAGE_SIZE);
        if (currentPage < 0)
            currentPage = 0;
        if (currentPage >= maxPages)
            currentPage = maxPages - 1;
        const currentWarnings = warnings.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
        const warnList = currentWarnings.map((warn, index) => {
            const actualIndex = currentPage * PAGE_SIZE + index + 1;
            return `**${actualIndex}.** ID: \`${warn._id}\` - Razón: ${warn.reason} - Moderador: <@${warn.moderatorId}> - ${warn.date.toLocaleDateString()}`;
        }).join("\n");
        // Attempting to fetch the user to get their username for the embed title
        // If not cached, we fallback to just their ID
        const user = await context.client.users.fetch(userId).catch(() => null);
        const username = user ? user.username : userId;
        const embed = new seyfert_1.Embed()
            .setTitle(`Advertencias de ${username} (${warnings.length})`)
            .setDescription(warnList)
            .setFooter({ text: `Página ${currentPage + 1} de ${maxPages}` })
            .setColor("Yellow");
        const row = new seyfert_1.ActionRow().addComponents(new seyfert_1.Button()
            .setCustomId(`warnpag_prev_${userId}_${currentPage}`)
            .setLabel("⬅️ Anterior")
            .setStyle(types_1.ButtonStyle.Primary)
            .setDisabled(currentPage === 0), new seyfert_1.Button()
            .setCustomId(`warnpag_next_${userId}_${currentPage}`)
            .setLabel("Siguiente ➡️")
            .setStyle(types_1.ButtonStyle.Primary)
            .setDisabled(currentPage >= maxPages - 1));
        await context.interaction.update({
            embeds: [embed],
            components: [row]
        });
    }
}
exports.default = WarningsPagination;
