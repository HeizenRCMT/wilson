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
exports.InventoryViewCommand = void 0;
const seyfert_1 = require("seyfert");
const UserInventory_Schema_1 = __importDefault(require("../../Schema/EconomySchema/UserInventory.Schema"));
const StoreItem_Schema_1 = __importDefault(require("../../Schema/EconomySchema/StoreItem.Schema"));
let InventoryViewCommand = class InventoryViewCommand extends seyfert_1.SubCommand {
    async run(context) {
        const userId = context.author.id;
        const inventory = await UserInventory_Schema_1.default.findOne({ userId });
        if (!inventory || inventory.items.length === 0) {
            return context.write({
                content: "Tu inventario está vacío."
            });
        }
        const allStoreItems = await StoreItem_Schema_1.default.find();
        const storeMap = new Map(allStoreItems.map(i => [i.id, i]));
        const embed = new seyfert_1.Embed()
            .setTitle(`Inventario de ${context.author.username}`)
            .setColor("Green")
            .setThumbnail(context.author.avatarURL());
        inventory.items.forEach((item, index) => {
            const original = storeMap.get(item.itemId);
            const name = item.customName || original?.name || "Objeto desconocido";
            const desc = item.customDescription || original?.description || "Sin descripción";
            embed.addFields([{
                    name: `[${index + 1}] ${name}${item.customName ? ` (${original?.name})` : ""}`,
                    value: `📝 ${desc}\n📅 Adquirido: <t:${Math.floor(item.acquiredAt.getTime() / 1000)}:R>`,
                    inline: false
                }]);
        });
        await context.write({
            embeds: [embed]
        });
    }
};
exports.InventoryViewCommand = InventoryViewCommand;
exports.InventoryViewCommand = InventoryViewCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "ver",
        description: "Mira los objetos que tienes en tu mochila",
    })
], InventoryViewCommand);
