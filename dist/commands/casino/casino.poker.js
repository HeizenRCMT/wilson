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
exports.PokerCommand = void 0;
const seyfert_1 = require("seyfert");
const cooldown_1 = require("@slipher/cooldown");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
const discord_js_1 = require("discord.js");
// ── Iconos ──────────────────────────────────────────────────────────────
const SUITS = ["♠️", "♥️", "♦️", "♣️"];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
function buildDeck() {
    const deck = [];
    for (const suit of SUITS)
        for (const rank of RANKS)
            deck.push({ rank, suit });
    return deck;
}
function shuffle(deck) {
    const d = [...deck];
    for (let i = d.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [d[i], d[j]] = [d[j], d[i]];
    }
    return d;
}
function rankValue(card) {
    const order = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    return order.indexOf(card.rank);
}
function evaluateHand(hand) {
    const sorted = [...hand].sort((a, b) => rankValue(b) - rankValue(a));
    const rankCounts = {};
    const suitCounts = {};
    for (const c of sorted) {
        rankCounts[c.rank] = (rankCounts[c.rank] ?? 0) + 1;
        suitCounts[c.suit] = (suitCounts[c.suit] ?? 0) + 1;
    }
    const isFlush = Object.values(suitCounts).some((v) => v === 5);
    const rankVals = sorted.map(rankValue);
    const isSequential = rankVals[0] - rankVals[4] === 4 && new Set(rankVals).size === 5;
    // Caso especial: escalera A-2-3-4-5
    const isLowStraight = JSON.stringify(rankVals) === JSON.stringify([12, 3, 2, 1, 0]);
    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    if (isFlush && (isSequential || isLowStraight)) {
        if (sorted[0].rank === "A" && !isLowStraight) {
            return { rank: 9, label: "Escalera Real", emoji: "👑" };
        }
        return { rank: 8, label: "Escalera de Color", emoji: "🌈" };
    }
    if (counts[0] === 4)
        return { rank: 7, label: "Póker (4 iguales)", emoji: "🃏" };
    if (counts[0] === 3 && counts[1] === 2)
        return { rank: 6, label: "Full House", emoji: "🏠" };
    if (isFlush)
        return { rank: 5, label: "Color", emoji: "🎨" };
    if (isSequential || isLowStraight)
        return { rank: 4, label: "Escalera", emoji: "📈" };
    if (counts[0] === 3)
        return { rank: 3, label: "Trío", emoji: "🔱" };
    if (counts[0] === 2 && counts[1] === 2)
        return { rank: 2, label: "Doble Par", emoji: "👯" };
    if (counts[0] === 2)
        return { rank: 1, label: "Par", emoji: "✌️" };
    return { rank: 0, label: "Carta Alta", emoji: "🃏" };
}
function formatHand(hand) {
    return hand.map((c) => `${c.rank}${c.suit}`).join(" ");
}
// Multiplicador de pago por el rango de la mano del jugador (vs. el dealer)
const MULTIPLIERS = {
    9: 5, // Escalera Real
    8: 4, // Escalera de Color
    7: 3, // Póker (4 iguales)
    6: 2.5, // Full House
    5: 2, // Color
    4: 1.5, // Escalera
    3: 1, // Trío
    2: 1, // Doble par
    1: 0.5, // Par
    0: 0, // Carta alta
};
// ─────────────────────────────────────────────────────────────────────────────
const options = {
    apuesta: (0, seyfert_1.createIntegerOption)({
        description: "Cantidad de monedas a apostar",
        required: true,
        min_value: 1,
    }),
};
let PokerCommand = class PokerCommand extends seyfert_1.SubCommand {
    async run(context) {
        const apuesta = context.options.apuesta;
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
        const deck = shuffle(buildDeck());
        const playerHand = deck.splice(0, 5);
        const dealerHand = deck.splice(0, 5);
        const playerResult = evaluateHand(playerHand);
        const dealerResult = evaluateHand(dealerHand);
        let delta;
        let resultMsg;
        if (playerResult.rank > dealerResult.rank) {
            // Victoria – multiplicador basado en la fuerza de la mano del jugador
            const mult = playerResult.rank === 0 ? 1 : (MULTIPLIERS[playerResult.rank] ?? 1);
            delta = Math.floor(apuesta * mult);
            resultMsg = `🏆 **¡Ganaste!** +${delta} 💰`;
        }
        else if (playerResult.rank < dealerResult.rank) {
            delta = -apuesta;
            resultMsg = `😢 **El dealer te ganó.** -${apuesta} 💰`;
        }
        else {
            delta = 0;
            resultMsg = `🤝 **Empate.** Te devuelven tu apuesta.`;
        }
        account.hand += delta;
        await account.save();
        return context.write({
            embeds: [
                {
                    title: "🎴 Póker — 5 Cartas",
                    color: delta > 0 ? 0x2ecc71 : delta < 0 ? 0xe74c3c : 0xf1c40f,
                    fields: [
                        {
                            name: `Tu mano ${playerResult.emoji} ${playerResult.label}`,
                            value: formatHand(playerHand),
                            inline: false,
                        },
                        {
                            name: `Dealer ${dealerResult.emoji} ${dealerResult.label}`,
                            value: formatHand(dealerHand),
                            inline: false,
                        },
                    ],
                    description: [
                        resultMsg,
                        ``,
                        `Saldo actual: **${account.hand}** 💰`,
                    ].join("\n"),
                    footer: {
                        text: `Apuesta: ${apuesta} 💰 • Multipliers varían según tu mano`,
                    },
                },
            ],
        });
    }
    onMiddlewaresError(context, error) {
        context.editOrReply({ content: error });
    }
};
exports.PokerCommand = PokerCommand;
exports.PokerCommand = PokerCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "poker",
        description: "Juega al poker contra el dealer (5 cartas, sin reemplazo)",
    }),
    (0, seyfert_1.Middlewares)(["cooldown"]),
    (0, cooldown_1.Cooldown)({
        type: cooldown_1.CooldownType.User,
        interval: 1000 * 30,
        uses: { default: 1 },
    }),
    (0, seyfert_1.Options)(options)
], PokerCommand);
