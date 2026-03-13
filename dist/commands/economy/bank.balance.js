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
exports.BalanceCommand = void 0;
const seyfert_1 = require("seyfert");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
const options = {
    usuario: (0, seyfert_1.createUserOption)({
        description: "El usuario a consultar",
        required: false
    })
};
let BalanceCommand = class BalanceCommand extends seyfert_1.SubCommand {
    async run(context) {
        const user = context.options.usuario || context.author;
        const userAccount = await Balance_Schema_1.default.findOne({ userId: user.id }) || new Balance_Schema_1.default({
            userId: user.id
        });
        userAccount.save();
        const bank = userAccount?.bank.toLocaleString();
        const hand = userAccount?.hand.toLocaleString();
        const totalBalance = Number(bank) + Number(hand);
        const balanceEmbed = new seyfert_1.Embed()
            .setTitle(`Dinero de ${user.username}`)
            .addFields([
            { name: "En mano", value: `${hand}`, inline: true },
            { name: "En el banco", value: `${bank}`, inline: true },
            { name: "Total", value: `${totalBalance.toLocaleString()}`, inline: true },
        ])
            .setColor("Random");
        await context.write({
            embeds: [balanceEmbed]
        });
    }
};
exports.BalanceCommand = BalanceCommand;
exports.BalanceCommand = BalanceCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "cartera",
        description: "Mira tu dinero",
    }),
    (0, seyfert_1.Options)(options)
], BalanceCommand);
