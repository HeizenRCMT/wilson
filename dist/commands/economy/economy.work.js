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
exports.WorkCommand = void 0;
const seyfert_1 = require("seyfert");
const cooldown_1 = require("@slipher/cooldown");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
let WorkCommand = class WorkCommand extends seyfert_1.SubCommand {
    async run(context) {
        const userAccount = await Balance_Schema_1.default.findOne({ userId: context.author.id }) || new Balance_Schema_1.default({
            userId: context.author.id
        });
        const moneyEarned = Math.floor(Math.random() * 100) + 1;
        userAccount.hand += moneyEarned;
        await userAccount.save();
        await context.write({
            content: `Has ganado ${moneyEarned} monedas!`,
        });
    }
    onMiddlewaresError(context, error) {
        context.editOrReply({ content: error });
    }
};
exports.WorkCommand = WorkCommand;
exports.WorkCommand = WorkCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "trabajar",
        description: "Consigue dinero trabajando",
    }),
    (0, seyfert_1.Middlewares)(["cooldown"]),
    (0, cooldown_1.Cooldown)({
        type: cooldown_1.CooldownType.User,
        interval: 1000 * 60,
        uses: {
            default: 2,
        },
    })
], WorkCommand);
