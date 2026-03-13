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
exports.StoreEditCommand = void 0;
const seyfert_1 = require("seyfert");
const StoreItem_Schema_1 = __importDefault(require("../../Schema/EconomySchema/StoreItem.Schema"));
const options = {
    id: (0, seyfert_1.createStringOption)({
        description: "ID del objeto que quieres editar",
        required: true
    }),
    nombre: (0, seyfert_1.createStringOption)({
        description: "Nuevo nombre visible",
        required: false
    }),
    descripcion: (0, seyfert_1.createStringOption)({
        description: "Nueva descripción",
        required: false
    }),
    precio: (0, seyfert_1.createIntegerOption)({
        description: "Nuevo precio",
        required: false,
        min_value: 0
    }),
    personalizable: (0, seyfert_1.createBooleanOption)({
        description: "¿Es personalizable ahora?",
        required: false
    })
};
let StoreEditCommand = class StoreEditCommand extends seyfert_1.SubCommand {
    async run(context) {
        const member = await context.member?.fetchPermissions();
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }
        const { id, nombre, descripcion, precio, personalizable } = context.options;
        const item = await StoreItem_Schema_1.default.findOne({ id });
        if (!item) {
            return context.write({
                content: `No se encontró el objeto con ID \`${id}\`.`
            });
        }
        if (nombre)
            item.name = nombre;
        if (descripcion)
            item.description = descripcion;
        if (precio !== undefined)
            item.price = precio;
        if (personalizable !== undefined)
            item.customizable = personalizable;
        await item.save();
        await context.write({
            content: `Se ha actualizado el objeto **${item.name}** correctamente.`
        });
    }
};
exports.StoreEditCommand = StoreEditCommand;
exports.StoreEditCommand = StoreEditCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "editar",
        description: "Edita un objeto existente en la tienda (Solo Staff)",
    }),
    (0, seyfert_1.Options)(options)
], StoreEditCommand);
