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
exports.LeaderboardCommand = void 0;
const seyfert_1 = require("seyfert");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
let LeaderboardCommand = class LeaderboardCommand extends seyfert_1.SubCommand {
    async run(context) {
        const topUsers = await Balance_Schema_1.default.aggregate([
            {
                $addFields: {
                    total: { $add: ["$hand", "$bank"] }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 10 }
        ]);
        if (topUsers.length === 0) {
            return context.write({
                content: "No hay datos de economía todavía."
            });
        }
        const embed = new seyfert_1.Embed()
            .setTitle("🏆 Tabla de Clasificación")
            .setColor("Gold")
            .setDescription("Los 10 usuarios más ricos del servidor.");
        for (let i = 0; i < topUsers.length; i++) {
            const data = topUsers[i];
            const userId = data.userId;
            const user = await context.client.users.fetch(userId).catch(() => null);
            const username = user ? user.username : `Usuario Desconocido (${userId})`;
            embed.addFields([{
                    name: `${i + 1}. ${username}`,
                    value: `💰 Total: **${data.total.toLocaleString()}** (Mano: ${data.hand.toLocaleString()} | Banco: ${data.bank.toLocaleString()})`,
                    inline: false
                }]);
        }
        return context.write({
            embeds: [embed]
        });
    }
};
exports.LeaderboardCommand = LeaderboardCommand;
exports.LeaderboardCommand = LeaderboardCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "ranking",
        description: "Muestra la tabla de clasificación de la economía",
    })
], LeaderboardCommand);
