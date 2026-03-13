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
exports.StoreViewCommand = void 0;
const seyfert_1 = require("seyfert");
const StoreItem_Schema_1 = __importDefault(require("../../Schema/EconomySchema/StoreItem.Schema"));
let StoreViewCommand = class StoreViewCommand extends seyfert_1.SubCommand {
    async run(context) {
        const items = await StoreItem_Schema_1.default.find();
        if (items.length === 0) {
            return context.write({
                content: "La tienda está vacía por ahora."
            });
        }
        const embed = new seyfert_1.Embed()
            .setTitle("🏪 Tienda de Objetos")
            .setDescription("¡Compra objetos y personalízalos si son compatibles!")
            .setColor("Blue");
        items.forEach(item => {
            embed.addFields([{
                    name: `${item.name} (ID: \`${item.id}\`)`,
                    value: `💰 Precio: **${item.price.toLocaleString()}**\n📝 ${item.description}\n⚙️ Personalizable: ${item.customizable ? "✅" : "❌"}`,
                    inline: false
                }]);
        });
        await context.write({
            embeds: [embed]
        });
    }
};
exports.StoreViewCommand = StoreViewCommand;
exports.StoreViewCommand = StoreViewCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "ver",
        description: "Mira los objetos disponibles en la tienda",
    })
], StoreViewCommand);
