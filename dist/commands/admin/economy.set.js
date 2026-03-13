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
exports.AdminSetCommand = void 0;
const seyfert_1 = require("seyfert");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
const options = {
    cantidad: (0, seyfert_1.createNumberOption)({
        description: "Cantidad de dinero a establecer",
        required: true,
        min_value: 0
    }),
    usuario: (0, seyfert_1.createUserOption)({
        description: "Usuario al que establecer dinero",
        required: true,
    })
};
let AdminSetCommand = class AdminSetCommand extends seyfert_1.SubCommand {
    async run(context) {
        const member = await context.member?.fetchPermissions();
        if (!member?.has(["Administrator"]) || context.author.id !== "709770108863643649") {
            return context.write({
                content: "No eres administrador"
            });
        }
        const { cantidad, usuario } = context.options;
        const userAccount = await Balance_Schema_1.default.findOne({ userId: usuario.id }) || new Balance_Schema_1.default({
            userId: usuario.id,
        });
        userAccount.hand = cantidad;
        userAccount.bank = 0; // Maybe only hand?
        await userAccount.save();
        return context.write({
            content: `✅ Se ha establecido el dinero de **${usuario.username}** en **${cantidad.toLocaleString()}** euros.`
        });
    }
    onMiddlewaresError(context, error) {
        context.editOrReply({ content: error });
    }
};
exports.AdminSetCommand = AdminSetCommand;
exports.AdminSetCommand = AdminSetCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "personalizar",
        description: "Personaliza (establece) el dinero de un usuario",
    }),
    (0, seyfert_1.Options)(options),
    (0, seyfert_1.Group)("economía")
], AdminSetCommand);
