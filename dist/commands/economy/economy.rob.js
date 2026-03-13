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
exports.RobCommand = void 0;
const seyfert_1 = require("seyfert");
const cooldown_1 = require("@slipher/cooldown");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
const options = {
    víctima: (0, seyfert_1.createUserOption)({
        description: "Víctima",
        required: true,
    })
};
let RobCommand = class RobCommand extends seyfert_1.SubCommand {
    async run(context) {
        const user = context.options.víctima;
        const userAccount = await Balance_Schema_1.default.findOne({ userId: context.author.id }) || new Balance_Schema_1.default({
            userId: context.author.id,
        });
        const victimAccount = await Balance_Schema_1.default.findOne({ userId: user.id }) || new Balance_Schema_1.default({
            userId: user.id,
        });
        const succesful = Math.random() < 0.5;
        if (victimAccount.hand < 20) {
            context.write({
                content: "La víctima no tiene suficiente dinero para robar"
            });
            return;
        }
        if (succesful) {
            const amount = Math.floor(Math.random() * victimAccount.hand);
            userAccount.hand += amount;
            victimAccount.hand -= amount;
            await userAccount.save();
            await victimAccount.save();
            const messages = [
                `Has robado exitosamente ${amount} euros a ${user.username}`,
                `${user.username} a ido a Barcelona y no ha sido una bonita experiencia, se sentía ligero luego de ir en metro, seguramente porque tú le robaste ${amount}€`,
                `En una pelea en el bar, increíblemente noqueaste a ${user.username} de un puñetazo y le robaste ${amount}€`,
                `Llamaste a ${user.username} y le dijiste que necesitaban su número de tarjeta para gestionar mejor su banco en Microsoft... Perdió ${amount}€`,
                `Ha llegado la hacienda, ${context.author.username} Sánchez le ha robado a ${user.username} un total de ${amount}€`,
                `En el parque de atracciones encontraste una cartera, la de ${user.username}, y tenía dentro ${amount}€`,
            ];
            context.write({
                content: messages[Math.floor(Math.random() * messages.length)]
            });
        }
        else if (!succesful) {
            const amount = Math.floor(Math.random() * userAccount.hand);
            userAccount.hand -= amount;
            await userAccount.save();
            context.write({
                content: `Fallaste en robar a ${user.username} y perdiste ${amount} monedas`
            });
        }
    }
    onMiddlewaresError(context, error) {
        context.editOrReply({ content: error });
    }
};
exports.RobCommand = RobCommand;
exports.RobCommand = RobCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "robar",
        description: "Roba dinero a alguien",
    }),
    (0, seyfert_1.Middlewares)(['cooldown']),
    (0, cooldown_1.Cooldown)({
        type: cooldown_1.CooldownType.User,
        interval: (1000 * 60) * 5,
        uses: {
            default: 1,
        }
    }),
    (0, seyfert_1.Options)(options)
], RobCommand);
