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
exports.BankWithdrawCommand = void 0;
const seyfert_1 = require("seyfert");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
const option = {
    amount: (0, seyfert_1.createNumberOption)({
        description: "Amount of money to withdraw",
        required: false,
    })
};
let BankWithdrawCommand = class BankWithdrawCommand extends seyfert_1.SubCommand {
    async run(context) {
        const amount = context.options.amount;
        const userAccount = await Balance_Schema_1.default.findOne({ userId: context.author.id }) || new Balance_Schema_1.default({
            userId: context.author.id
        });
        if (!amount) {
            userAccount.hand += userAccount.bank;
            userAccount.bank = 0;
            userAccount.save();
            await context.write({
                content: `Retiraste todo tu dinero de tu cuenta bancaria`,
            });
        }
        else {
            if (userAccount.bank < amount) {
                await context.write({
                    content: "No tienes suficiente dinero para retirar",
                });
                return;
            }
            userAccount.bank -= amount;
            userAccount.hand += amount;
            await userAccount.save();
            await context.write({
                content: `Retiraste ${amount} monedas de tu cuenta bancaria`,
            });
        }
    }
};
exports.BankWithdrawCommand = BankWithdrawCommand;
exports.BankWithdrawCommand = BankWithdrawCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "retirar",
        description: "Retira dinero de tu cuenta bancaria",
    }),
    (0, seyfert_1.Options)(option)
], BankWithdrawCommand);
