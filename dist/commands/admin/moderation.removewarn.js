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
exports.ModerationRemoveWarnCommand = void 0;
const seyfert_1 = require("seyfert");
const Warn_Schema_1 = __importDefault(require("../../Schema/ModerationSchema/Warn.Schema"));
const options = {
    id: (0, seyfert_1.createStringOption)({
        description: "ID de la advertencia a eliminar",
        required: true,
    })
};
let ModerationRemoveWarnCommand = class ModerationRemoveWarnCommand extends seyfert_1.SubCommand {
    async run(context) {
        const member = await context.member?.fetchPermissions();
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }
        const { id } = context.options;
        try {
            const deletedWarn = await Warn_Schema_1.default.findByIdAndDelete(id);
            if (!deletedWarn) {
                return context.write({
                    content: `No se encontró ninguna advertencia con el ID \`${id}\`.`,
                });
            }
            return context.write({
                content: `Advertencia eliminada correctamente.\n**Usuario**: <@${deletedWarn.userId}>\n**Razón**: ${deletedWarn.reason}`,
            });
        }
        catch (error) {
            return context.write({
                content: `Hubo un error al intentar eliminar la advertencia. Asegúrate de que el ID es válido.`,
            });
        }
    }
};
exports.ModerationRemoveWarnCommand = ModerationRemoveWarnCommand;
exports.ModerationRemoveWarnCommand = ModerationRemoveWarnCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "quitar-advertencia",
        description: "Elimina una advertencia de un usuario usando su ID",
    }),
    (0, seyfert_1.Options)(options),
    (0, seyfert_1.Group)("moderación")
], ModerationRemoveWarnCommand);
