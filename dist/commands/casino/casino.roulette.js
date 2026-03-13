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
exports.RouletteCommand = void 0;
const seyfert_1 = require("seyfert");
const cooldown_1 = require("@slipher/cooldown");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
const discord_js_1 = require("discord.js");
const ROULETTE_NUMBERS = Array.from({ length: 37 }, (_, i) => i); // 0–36
const RED_NUMBERS = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];
function getColor(n) {
    if (n === 0)
        return "verde 🟢";
    return RED_NUMBERS.includes(n) ? "rojo 🔴" : "negro ⚫";
}
const options = {
    apuesta: (0, seyfert_1.createIntegerOption)({
        description: "Cantidad de monedas a apostar",
        required: true,
        min_value: 1,
    }),
    tipo: (0, seyfert_1.createStringOption)({
        description: "Tipo de apuesta: rojo, negro, par, impar, número (0-36)",
        required: true,
        choices: [
            { name: "🔴 Rojo (x2)", value: "rojo" },
            { name: "⚫ Negro (x2)", value: "negro" },
            { name: "🔢 Par (x2)", value: "par" },
            { name: "🔣 Impar (x2)", value: "impar" },
            { name: "1️⃣ Números 1-12 (x3)", value: "1-12" },
            { name: "2️⃣ Números 13-24 (x3)", value: "13-24" },
            { name: "3️⃣ Números 25-36 (x3)", value: "25-36" },
        ],
    }),
    numero: (0, seyfert_1.createIntegerOption)({
        description: "Número exacto (0-36) – paga x36. Ignora el tipo si se usa",
        required: false,
        min_value: 0,
        max_value: 36,
    }),
};
let RouletteCommand = class RouletteCommand extends seyfert_1.SubCommand {
    async run(context) {
        const apuesta = context.options.apuesta;
        const tipo = context.options.tipo;
        const numeroExacto = context.options.numero;
        const account = await Balance_Schema_1.default.findOne({ userId: context.author.id });
        if (!account) {
            return context.write({
                content: "❌ No tienes cuenta. Usa `/economía balance` para empezar.",
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        }
        if (account.hand < apuesta) {
            return context.write({
                content: `❌ No tienes suficientes monedas. Tienes **${account.hand}** 💰`,
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        }
        const resultado = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)];
        const colorResultado = getColor(resultado);
        let ganaste = false;
        let multiplicador = 0;
        let apuestaDesc = "";
        if (numeroExacto !== undefined && numeroExacto !== null) {
            // Apuesta a número exacto
            ganaste = resultado === numeroExacto;
            multiplicador = 36;
            apuestaDesc = `número exacto **${numeroExacto}**`;
        }
        else {
            switch (tipo) {
                case "rojo":
                    ganaste = RED_NUMBERS.includes(resultado);
                    multiplicador = 2;
                    apuestaDesc = "🔴 rojo";
                    break;
                case "negro":
                    ganaste = !RED_NUMBERS.includes(resultado) && resultado !== 0;
                    multiplicador = 2;
                    apuestaDesc = "⚫ negro";
                    break;
                case "par":
                    ganaste = resultado !== 0 && resultado % 2 === 0;
                    multiplicador = 2;
                    apuestaDesc = "par";
                    break;
                case "impar":
                    ganaste = resultado % 2 !== 0;
                    multiplicador = 2;
                    apuestaDesc = "impar";
                    break;
                case "1-12":
                    ganaste = resultado >= 1 && resultado <= 12;
                    multiplicador = 3;
                    apuestaDesc = "1-12";
                    break;
                case "13-24":
                    ganaste = resultado >= 13 && resultado <= 24;
                    multiplicador = 3;
                    apuestaDesc = "13-24";
                    break;
                case "25-36":
                    ganaste = resultado >= 25 && resultado <= 36;
                    multiplicador = 3;
                    apuestaDesc = "25-36";
                    break;
            }
        }
        const delta = ganaste ? apuesta * multiplicador - apuesta : -apuesta;
        account.hand += delta;
        await account.save();
        const sign = delta > 0 ? `+${delta}` : `${delta}`;
        const emoji = ganaste ? "🎉" : "😢";
        return context.write({
            embeds: [
                {
                    title: "🎰 Ruleta",
                    color: ganaste ? 0x2ecc71 : 0xe74c3c,
                    description: [
                        `La bola cayó en… **${resultado}** (${colorResultado})`,
                        ``,
                        `Tu apuesta: **${apuestaDesc}** • ${apuesta} 💰`,
                        ganaste
                            ? `${emoji} **¡Ganaste! ${sign} 💰** (x${multiplicador})`
                            : `${emoji} **Perdiste. ${delta} 💰**`,
                        ``,
                        `Saldo actual: **${account.hand}** 💰`,
                    ].join("\n"),
                    footer: { text: "El 0 siempre le da al casino 😈" },
                },
            ],
        });
    }
    onMiddlewaresError(context, error) {
        context.editOrReply({ content: error });
    }
};
exports.RouletteCommand = RouletteCommand;
exports.RouletteCommand = RouletteCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "ruleta",
        description: "Gira la ruleta y apuesta",
    }),
    (0, seyfert_1.Middlewares)(["cooldown"]),
    (0, cooldown_1.Cooldown)({
        type: cooldown_1.CooldownType.User,
        interval: 1000 * 20,
        uses: { default: 1 },
    }),
    (0, seyfert_1.Options)(options)
], RouletteCommand);
