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
exports.SlutCommand = void 0;
const seyfert_1 = require("seyfert");
const cooldown_1 = require("@slipher/cooldown");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
let SlutCommand = class SlutCommand extends seyfert_1.SubCommand {
    async run(context) {
        const userAccount = await Balance_Schema_1.default.findOne({ userId: context.author.id }) || new Balance_Schema_1.default({
            userId: context.author.id
        });
        const members = ["\_heizenrc", "flacidpankake", "corbacho\_77", "noctyfruitt\_", "nombren.t", "tony\_r3c", "\_fabianykeiner\_", "izan\_el\_cocotero", "phewnow\_", "tenqueto13", "ayorc", "john\_gato", "lukax699", "\_gabii\_tm67", "mendez.\_\_", "lamartaa44", "quemimadreque", "rnat.\_\_", "im.nessie"];
        const member = members[Math.floor(Math.random() * members.length)];
        const moneyEarned = Math.floor(Math.random() * 500) + 1;
        userAccount.hand += moneyEarned;
        const messages = [
            `Te has follado a ${member}, este te ha dado ${moneyEarned} eurillos`,
            `${member} te ha pedido un rapidito y tú milagrosamente aceptaste, te han pagado ${moneyEarned}€`,
            `No es ético, ni moral, pero si te mola adelante, total ganaste ${moneyEarned}€`,
            `El sabor no era el mejor, pero ganar plata de ${member} sí, en total unos ${moneyEarned}€`,
            `Tal vez cuando sepas mejor ${member} te pagará mejor, por ahora te dan ${moneyEarned}€`,
            `${moneyEarned}€ y ni tan mal para un callejón sucio, dale las gracias a ${member}`,
            `${member} es muy raro con sus fetiches, pero si de ${member} se saca guita es mejor no pensarlo ||${moneyEarned}€||`,
        ];
        await userAccount.save();
        await context.write({
            content: messages[Math.floor(Math.random() * messages.length)],
        });
    }
    onMiddlewaresError(context, error) {
        context.editOrReply({ content: error });
    }
};
exports.SlutCommand = SlutCommand;
exports.SlutCommand = SlutCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "prostituir",
        description: "Gana dinero follando",
    }),
    (0, seyfert_1.Middlewares)(['cooldown']),
    (0, cooldown_1.Cooldown)({
        type: cooldown_1.CooldownType.User,
        interval: (1000 * 60) * 60,
        uses: {
            default: 1,
        }
    })
], SlutCommand);
