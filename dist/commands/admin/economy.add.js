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
exports.AdminAddCommand = void 0;
const seyfert_1 = require("seyfert");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
const options = {
    cantidad: (0, seyfert_1.createNumberOption)({
        description: "Cantidad de dinero a añadir",
        required: true,
        min_value: 1
    }),
    usuario: (0, seyfert_1.createUserOption)({
        description: "Usuario al que añadir dinero",
        required: true,
    })
};
let AdminAddCommand = class AdminAddCommand extends seyfert_1.SubCommand {
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
        userAccount.hand += cantidad;
        await userAccount.save();
        return context.write({
            content: `✅ Se han añadido **${cantidad.toLocaleString()}** euros a la cartera de **${usuario.username}**.`
        });
    }
    onMiddlewaresError(context, error) {
        context.editOrReply({ content: error });
    }
};
exports.AdminAddCommand = AdminAddCommand;
exports.AdminAddCommand = AdminAddCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "añadir",
        description: "Añade dinero a un usuario",
    }),
    (0, seyfert_1.Options)(options),
    (0, seyfert_1.Group)("economía")
], AdminAddCommand);
