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
exports.StoreAddCommand = void 0;
const seyfert_1 = require("seyfert");
const StoreItem_Schema_1 = __importDefault(require("../../Schema/EconomySchema/StoreItem.Schema"));
const options = {
    id: (0, seyfert_1.createStringOption)({
        description: "ID único del objeto (ej: casco_oro)",
        required: true
    }),
    nombre: (0, seyfert_1.createStringOption)({
        description: "Nombre visible del objeto",
        required: true
    }),
    descripcion: (0, seyfert_1.createStringOption)({
        description: "Descripción del objeto",
        required: true
    }),
    precio: (0, seyfert_1.createIntegerOption)({
        description: "Precio del objeto",
        required: true,
        min_value: 0
    }),
    personalizable: (0, seyfert_1.createBooleanOption)({
        description: "¿Se puede personalizar este objeto?",
        required: true
    })
};
let StoreAddCommand = class StoreAddCommand extends seyfert_1.SubCommand {
    async run(context) {
        const member = await context.member?.fetchPermissions();
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }
        const { id, nombre, descripcion, precio, personalizable } = context.options;
        const existing = await StoreItem_Schema_1.default.findOne({ id });
        if (existing) {
            return context.write({
                content: `Ya existe un objeto con el ID \`${id}\`.`
            });
        }
        const newItem = new StoreItem_Schema_1.default({
            id,
            name: nombre,
            description: descripcion,
            price: precio,
            customizable: personalizable
        });
        await newItem.save();
        await context.write({
            content: `Se ha añadido **${nombre}** a la tienda correctamente.`
        });
    }
};
exports.StoreAddCommand = StoreAddCommand;
exports.StoreAddCommand = StoreAddCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "añadir",
        description: "Añade un objeto a la tienda (Solo Staff)",
    }),
    (0, seyfert_1.Options)(options)
], StoreAddCommand);
