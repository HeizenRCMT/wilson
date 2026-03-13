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
exports.InventoryRemoveCommand = void 0;
const seyfert_1 = require("seyfert");
const UserInventory_Schema_1 = __importDefault(require("../../Schema/EconomySchema/UserInventory.Schema"));
const options = {
    indice: (0, seyfert_1.createIntegerOption)({
        description: "El número del objeto que quieres tirar",
        required: true,
        min_value: 1
    })
};
let InventoryRemoveCommand = class InventoryRemoveCommand extends seyfert_1.SubCommand {
    async run(context) {
        const { indice } = context.options;
        const userId = context.author.id;
        const inventory = await UserInventory_Schema_1.default.findOne({ userId });
        if (!inventory || !inventory.items[indice - 1]) {
            return context.write({
                content: "No se encontró el objeto en tu inventario."
            });
        }
        inventory.items.splice(indice - 1, 1);
        await inventory.save();
        await context.write({
            content: `Has tirado el objeto a la basura. ¡Ya no está en tu inventario!`
        });
    }
};
exports.InventoryRemoveCommand = InventoryRemoveCommand;
exports.InventoryRemoveCommand = InventoryRemoveCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "tirar",
        description: "Tira un objeto de tu inventario para siempre",
    }),
    (0, seyfert_1.Options)(options)
], InventoryRemoveCommand);
