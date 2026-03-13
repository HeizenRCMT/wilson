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
exports.AdminSubstractCommand = void 0;
const seyfert_1 = require("seyfert");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
const options = {
    cantidad: (0, seyfert_1.createNumberOption)({
        description: "Cantidad de dinero a quitar",
        required: true,
        min_value: 1
    }),
    usuario: (0, seyfert_1.createUserOption)({
        description: "Usuario al que quitar dinero",
        required: true,
    })
};
let AdminSubstractCommand = class AdminSubstractCommand extends seyfert_1.SubCommand {
    async run(context) {
        const member = await context.member?.fetchPermissions();
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }
        const { cantidad, usuario } = context.options;
        const userAccount = await Balance_Schema_1.default.findOne({ userId: usuario.id });
        if (!userAccount || (userAccount.hand + userAccount.bank) < cantidad) {
            return context.write({
                content: `⚠️ El usuario **${usuario.username}** no tiene suficiente dinero para quitarle **${cantidad}**.`
            });
        }
        // Subtract from hand first
        if (userAccount.hand >= cantidad) {
            userAccount.hand -= cantidad;
        }
        else {
            const remaining = cantidad - userAccount.hand;
            userAccount.hand = 0;
            userAccount.bank -= remaining;
        }
        await userAccount.save();
        return context.write({
            content: `✅ Se han quitado **${cantidad.toLocaleString()}** euros a **${usuario.username}**.`
        });
    }
    onMiddlewaresError(context, error) {
        context.editOrReply({ content: error });
    }
};
exports.AdminSubstractCommand = AdminSubstractCommand;
exports.AdminSubstractCommand = AdminSubstractCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "quitar",
        description: "Quita dinero a un usuario",
    }),
    (0, seyfert_1.Options)(options),
    (0, seyfert_1.Group)("economía")
], AdminSubstractCommand);
