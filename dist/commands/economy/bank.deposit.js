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
exports.BankDepositCommand = void 0;
const seyfert_1 = require("seyfert");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
const option = {
    amount: (0, seyfert_1.createNumberOption)({
        description: "Amount of money to deposit",
        required: false,
    })
};
let BankDepositCommand = class BankDepositCommand extends seyfert_1.SubCommand {
    async run(context) {
        const amount = context.options.amount;
        const userAccount = await Balance_Schema_1.default.findOne({ userId: context.author.id }) || new Balance_Schema_1.default({
            userId: context.author.id
        });
        if (!amount) {
            userAccount.bank += userAccount.hand;
            userAccount.hand = 0;
            userAccount.save();
            await context.write({
                content: `Depositaste todo tu dinero en tu cuenta bancaria`,
            });
        }
        else {
            if (userAccount.hand < amount) {
                await context.write({
                    content: "No tienes suficiente dinero para depositar",
                });
                return;
            }
            userAccount.hand -= amount;
            userAccount.bank += amount;
            await userAccount.save();
            await context.write({
                content: `Depositaste ${amount} monedas en tu cuenta bancaria`,
            });
        }
    }
};
exports.BankDepositCommand = BankDepositCommand;
exports.BankDepositCommand = BankDepositCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "depositar",
        description: "Deposita dinero en tu cuenta bancaria",
    }),
    (0, seyfert_1.Options)(option)
], BankDepositCommand);
