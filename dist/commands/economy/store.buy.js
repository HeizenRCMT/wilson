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
exports.StoreBuyCommand = void 0;
const seyfert_1 = require("seyfert");
const StoreItem_Schema_1 = __importDefault(require("../../Schema/EconomySchema/StoreItem.Schema"));
const UserInventory_Schema_1 = __importDefault(require("../../Schema/EconomySchema/UserInventory.Schema"));
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
const options = {
    id: (0, seyfert_1.createStringOption)({
        description: "ID del objeto que quieres comprar",
        required: true
    })
};
let StoreBuyCommand = class StoreBuyCommand extends seyfert_1.SubCommand {
    async run(context) {
        const { id } = context.options;
        const userId = context.author.id;
        const item = await StoreItem_Schema_1.default.findOne({ id });
        if (!item) {
            return context.write({
                content: "Ese objeto no existe en la tienda."
            });
        }
        const userBalance = await Balance_Schema_1.default.findOne({ userId }) || new Balance_Schema_1.default({ userId });
        // Prefer cleaning from hand, then bank
        const totalMoney = userBalance.hand + userBalance.bank;
        if (totalMoney < item.price) {
            return context.write({
                content: `No tienes suficiente dinero. El objeto cuesta **${item.price.toLocaleString()}** y tú tienes **${totalMoney.toLocaleString()}**.`
            });
        }
        // Deduct price
        if (userBalance.hand >= item.price) {
            userBalance.hand -= item.price;
        }
        else {
            const remaining = item.price - userBalance.hand;
            userBalance.hand = 0;
            userBalance.bank -= remaining;
        }
        await userBalance.save();
        // Add to inventory
        let inventory = await UserInventory_Schema_1.default.findOne({ userId });
        if (!inventory) {
            inventory = new UserInventory_Schema_1.default({ userId, items: [] });
        }
        inventory.items.push({
            itemId: item.id,
            acquiredAt: new Date()
        });
        await inventory.save();
        await context.write({
            content: `Has comprado **${item.name}** por **${item.price.toLocaleString()}**. ¡Disfrútalo!`
        });
    }
};
exports.StoreBuyCommand = StoreBuyCommand;
exports.StoreBuyCommand = StoreBuyCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "comprar",
        description: "Compra un objeto de la tienda",
    }),
    (0, seyfert_1.Options)(options)
], StoreBuyCommand);
