"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationWarningsCommand = void 0;
const seyfert_1 = require("seyfert");
const types_1 = require("seyfert/lib/types");
const Warn_Schema_1 = __importDefault(require("../../Schema/ModerationSchema/Warn.Schema"));
const options = {
    usuario: (0, seyfert_1.createUserOption)({
        description: "Usuario del que quieres ver las advertencias",
        required: true,
    })
};
let ModerationWarningsCommand = class ModerationWarningsCommand extends seyfert_1.SubCommand {
    async run(context) {
        const { usuario } = context.options;
        const warnings = await Warn_Schema_1.default.find({
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
        const embed = new seyfert_1.Embed()
            .setTitle(`Advertencias de ${usuario.username} (${warnings.length})`)
            .setDescription(warnList)
            .setFooter({ text: `Página ${currentPage + 1} de ${maxPages}` })
            .setColor("Yellow");
        const row = new seyfert_1.ActionRow().addComponents(new seyfert_1.Button()
            .setCustomId(`warnpag_prev_${usuario.id}_${currentPage}`)
            .setLabel("⬅️ Anterior")
            .setStyle(types_1.ButtonStyle.Primary)
            .setDisabled(currentPage === 0), new seyfert_1.Button()
            .setCustomId(`warnpag_next_${usuario.id}_${currentPage}`)
            .setLabel("Siguiente ➡️")
            .setStyle(types_1.ButtonStyle.Primary)
            .setDisabled(currentPage >= maxPages - 1));
        await context.write({
            embeds: [embed],
            components: [row]
        });
    }
};
exports.ModerationWarningsCommand = ModerationWarningsCommand;
exports.ModerationWarningsCommand = ModerationWarningsCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "advertencias",
        description: "Ve las advertencias de un usuario",
    }),
    (0, seyfert_1.Options)(options),
    (0, seyfert_1.Group)("moderación")
], ModerationWarningsCommand);
