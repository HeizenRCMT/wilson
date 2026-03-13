"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const seyfert_1 = require("seyfert");
const bank_balance_1 = require("./bank.balance");
const economy_work_1 = require("./economy.work");
const bank_deposit_1 = require("./bank.deposit");
const bank_withdraw_1 = require("./bank.withdraw");
const economy_rob_1 = require("./economy.rob");
const economy_slut_1 = require("./economy.slut");
const economy_ranking_1 = require("./economy.ranking");
let EconomyParent = class EconomyParent extends seyfert_1.Command {
};
EconomyParent = __decorate([
    (0, seyfert_1.Declare)({
        name: "economía",
        description: "Comandos de economía",
    }),
    (0, seyfert_1.Options)([
        bank_balance_1.BalanceCommand,
        economy_work_1.WorkCommand,
        bank_deposit_1.BankDepositCommand,
        bank_withdraw_1.BankWithdrawCommand,
        economy_rob_1.RobCommand,
        economy_slut_1.SlutCommand,
        economy_ranking_1.LeaderboardCommand
    ])
], EconomyParent);
exports.default = EconomyParent;
