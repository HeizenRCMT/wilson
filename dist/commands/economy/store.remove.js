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
exports.StoreRemoveCommand = void 0;
const seyfert_1 = require("seyfert");
const StoreItem_Schema_1 = __importDefault(require("../../Schema/EconomySchema/StoreItem.Schema"));
const options = {
    id: (0, seyfert_1.createStringOption)({
        description: "ID del objeto a eliminar",
        required: true
    })
};
let StoreRemoveCommand = class StoreRemoveCommand extends seyfert_1.SubCommand {
    async run(context) {
        const member = await context.member?.fetchPermissions();
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }
        const { id } = context.options;
        const deleted = await StoreItem_Schema_1.default.findOneAndDelete({ id });
        if (!deleted) {
            return context.write({
                content: `No se encontró ningún objeto con el ID \`${id}\`.`
            });
        }
        await context.write({
            content: `Se ha eliminado el objeto **${deleted.name}** de la tienda.`
        });
    }
};
exports.StoreRemoveCommand = StoreRemoveCommand;
exports.StoreRemoveCommand = StoreRemoveCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "quitar",
        description: "Elimina un objeto de la tienda (Solo Staff)",
    }),
    (0, seyfert_1.Options)(options)
], StoreRemoveCommand);
