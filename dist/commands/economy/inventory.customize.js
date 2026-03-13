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
exports.InventoryCustomizeCommand = void 0;
const seyfert_1 = require("seyfert");
const UserInventory_Schema_1 = __importDefault(require("../../Schema/EconomySchema/UserInventory.Schema"));
const StoreItem_Schema_1 = __importDefault(require("../../Schema/EconomySchema/StoreItem.Schema"));
const options = {
    indice: (0, seyfert_1.createIntegerOption)({
        description: "El número del objeto en tu inventario (ej: 1, 2...)",
        required: true,
        min_value: 1
    }),
    nombre: (0, seyfert_1.createStringOption)({
        description: "Nuevo nombre para el objeto",
        required: false
    }),
    descripcion: (0, seyfert_1.createStringOption)({
        description: "Nueva descripción para el objeto",
        required: false
    })
};
let InventoryCustomizeCommand = class InventoryCustomizeCommand extends seyfert_1.SubCommand {
    async run(context) {
        const { indice, nombre, descripcion } = context.options;
        const userId = context.author.id;
        const inventory = await UserInventory_Schema_1.default.findOne({ userId });
        if (!inventory || !inventory.items[indice - 1]) {
            return context.write({
                content: "No se encontró el objeto en la posición indicada."
            });
        }
        const itemInInv = inventory.items[indice - 1];
        const originalItem = await StoreItem_Schema_1.default.findOne({ id: itemInInv.itemId });
        if (!originalItem?.customizable) {
            return context.write({
                content: "Este objeto no se puede personalizar."
            });
        }
        if (nombre)
            itemInInv.customName = nombre;
        if (descripcion)
            itemInInv.customDescription = descripcion;
        await inventory.save();
        await context.write({
            content: `Has personalizado el objeto **${originalItem.name}** correctamente.`
        });
    }
};
exports.InventoryCustomizeCommand = InventoryCustomizeCommand;
exports.InventoryCustomizeCommand = InventoryCustomizeCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "personalizar",
        description: "Personaliza un objeto de tu inventario (si es compatible)",
    }),
    (0, seyfert_1.Options)(options)
], InventoryCustomizeCommand);
