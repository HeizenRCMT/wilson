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
exports.BlackjackCommand = void 0;
const seyfert_1 = require("seyfert");
const types_1 = require("seyfert/lib/types");
const cooldown_1 = require("@slipher/cooldown");
const Balance_Schema_1 = __importDefault(require("../../Schema/EconomySchema/Balance.Schema"));
// ── Ayudantes de cartas ───────────────────────────────────────────────────────
const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
function buildDeck() {
    const deck = [];
    for (const suit of SUITS)
        for (const val of VALUES)
            deck.push(`${val}${suit}`);
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
function cardValue(card) {
    const rank = card.replace(/[♠♥♦♣]/g, "");
    if (["J", "Q", "K"].includes(rank))
        return 10;
    if (rank === "A")
        return 11;
    return parseInt(rank, 10);
}
function handScore(hand) {
    let score = hand.reduce((sum, c) => sum + cardValue(c), 0);
    let aces = hand.filter((c) => c.startsWith("A")).length;
    while (score > 21 && aces-- > 0)
        score -= 10;
    return score;
}
// ── Constructor de embeds ─────────────────────────────────────────────────────
function buildEmbed(playerHand, dealerHand, dealerVisible, state, apuesta, delta, balance) {
    const playerScore = handScore(playerHand);
    const dealerScore = dealerVisible ? handScore(dealerHand) : cardValue(dealerHand[0]);
    const dealerDisplay = dealerVisible
        ? dealerHand.join("  ")
        : `${dealerHand[0]}  🂠`;
    const stateInfo = {
        playing: {
            title: "🃏 Blackjack — Tu turno",
            color: 0x5865f2,
            desc: "¿Pides carta o te plantas?",
        },
        win: {
            title: "🏆 ¡Ganaste!",
            color: 0x2ecc71,
            desc: `**+${delta} 💰** — Saldo: **${balance}** 💰`,
        },
        lose: {
            title: "😢 El dealer ganó",
            color: 0xe74c3c,
            desc: `**${delta} 💰** — Saldo: **${balance}** 💰`,
        },
        bust: {
            title: "💥 ¡Te pasaste de 21!",
            color: 0xe74c3c,
            desc: `**${delta} 💰** — Saldo: **${balance}** 💰`,
        },
        tie: {
            title: "🤝 Empate",
            color: 0xf1c40f,
            desc: `Te devuelven la apuesta — Saldo: **${balance}** 💰`,
        },
    };
    const info = stateInfo[state];
    return {
        title: info.title,
        color: info.color,
        fields: [
            {
                name: `Tu mano — ${playerScore} pts`,
                value: playerHand.join("  "),
                inline: true,
            },
            {
                name: dealerVisible
                    ? `Dealer — ${dealerScore} pts`
                    : `Dealer — ? pts`,
                value: dealerDisplay,
                inline: true,
            },
        ],
        description: info.desc,
        footer: { text: `Apuesta: ${apuesta} 💰` },
    };
}
// ── Botones ───────────────────────────────────────────────────────────────────
function buildButtons(disabled = false) {
    return [
        {
            type: 1, // ActionRow
            components: [
                {
                    type: 2, // Botón
                    style: types_1.ButtonStyle.Success,
                    label: "🃏 Pedir carta",
                    custom_id: "bj_hit",
                    disabled,
                },
                {
                    type: 2,
                    style: types_1.ButtonStyle.Danger,
                    label: "✋ Plantarse",
                    custom_id: "bj_stand",
                    disabled,
                },
            ],
        },
    ];
}
// ── Comando ───────────────────────────────────────────────────────────────────
const options = {
    apuesta: (0, seyfert_1.createIntegerOption)({
        description: "Cantidad de monedas a apostar",
        required: true,
        min_value: 1,
    }),
};
let BlackjackCommand = class BlackjackCommand extends seyfert_1.SubCommand {
    async run(context) {
        const apuesta = context.options.apuesta;
        const account = await Balance_Schema_1.default.findOne({ userId: context.author.id });
        if (!account) {
            return context.write({
                content: "❌ No tienes cuenta. Usa `/economía cartera` para empezar.",
                flags: types_1.MessageFlags.Ephemeral,
            });
        }
        if (account.hand < apuesta) {
            return context.write({
                content: `❌ No tienes suficientes monedas. Tienes **${account.hand}**€`,
                flags: types_1.MessageFlags.Ephemeral,
            });
        }
        // Repartir cartas iniciales
        const deck = shuffle(buildDeck());
        const playerHand = [deck.pop(), deck.pop()];
        const dealerHand = [deck.pop(), deck.pop()];
        // Comprobar blackjack natural
        const playerBJ = handScore(playerHand) === 21;
        const dealerBJ = handScore(dealerHand) === 21;
        if (playerBJ || dealerBJ) {
            let state;
            let delta = 0;
            if (playerBJ && dealerBJ) {
                state = "tie";
                delta = 0;
            }
            else if (playerBJ) {
                state = "win";
                delta = Math.floor(apuesta * 1.5); // BJ paga 3:2
            }
            else {
                state = "lose";
                delta = -apuesta;
            }
            account.hand += delta;
            await account.save();
            return context.write({
                embeds: [buildEmbed(playerHand, dealerHand, true, state, apuesta, delta, account.hand)],
            });
        }
        // Enviar mensaje inicial con botones
        const msg = await context.write({
            embeds: [buildEmbed(playerHand, dealerHand, false, "playing", apuesta, 0, account.hand)],
            components: buildButtons(),
        }, true);
        if (!msg)
            return;
        const collector = msg.createComponentCollector({ idle: 60_000 });
        collector.run(["bj_hit", "bj_stand"], async (btnCtx) => {
            // Solo permitir al jugador original
            if (btnCtx.user.id !== context.author.id) {
                await btnCtx.write({
                    content: "❌ Este no es tu juego.",
                    flags: types_1.MessageFlags.Ephemeral,
                });
                return;
            }
            if (btnCtx.customId === "bj_hit") {
                playerHand.push(deck.pop());
                const score = handScore(playerHand);
                if (score > 21) {
                    // Pasarse de 21
                    collector.stop("bust");
                    const delta = -apuesta;
                    account.hand += delta;
                    await account.save();
                    await btnCtx.update({
                        embeds: [buildEmbed(playerHand, dealerHand, true, "bust", apuesta, delta, account.hand)],
                        components: buildButtons(true),
                    });
                }
                else if (score === 21) {
                    // Plantarse automáticamente al llegar a 21
                    collector.stop("stand");
                    await resolveStand(btnCtx, playerHand, dealerHand, deck, apuesta, account);
                }
                else {
                    // Todavía jugando
                    await btnCtx.update({
                        embeds: [buildEmbed(playerHand, dealerHand, false, "playing", apuesta, 0, account.hand)],
                        components: buildButtons(),
                    });
                }
            }
            else {
                // Plantarse
                collector.stop("stand");
                await resolveStand(btnCtx, playerHand, dealerHand, deck, apuesta, account);
            }
        });
        collector.run("stop", async () => {
            // Tiempo agotado — deshabilitar botones y mostrar mensaje de tiempo agotado
            await msg.edit({
                embeds: [
                    {
                        title: "⏰ Tiempo agotado",
                        color: 0x95a5a6,
                        description: `La partida se canceló por inactividad.\nTu apuesta de **${apuesta} 💰** fue devuelta.`,
                    },
                ],
                components: buildButtons(true),
            });
        });
    }
    onMiddlewaresError(context, error) {
        context.editOrReply({ content: error });
    }
};
exports.BlackjackCommand = BlackjackCommand;
exports.BlackjackCommand = BlackjackCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "blackjack",
        description: "Juega al blackjack contra el dealer",
    }),
    (0, seyfert_1.Middlewares)(["cooldown"]),
    (0, cooldown_1.Cooldown)({
        type: cooldown_1.CooldownType.User,
        interval: 1000 * 15,
        uses: { default: 1 },
    }),
    (0, seyfert_1.Options)(options)
], BlackjackCommand);
// ── Resolución del dealer (plantarse) ─────────────────────────────────────────
async function resolveStand(btnCtx, playerHand, dealerHand, deck, apuesta, account) {
    // El dealer pide hasta tener 17 o más
    while (handScore(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    const playerScore = handScore(playerHand);
    const dealerScore = handScore(dealerHand);
    let state;
    let delta = 0;
    if (dealerScore > 21 || playerScore > dealerScore) {
        state = "win";
        delta = apuesta;
    }
    else if (playerScore < dealerScore) {
        state = "lose";
        delta = -apuesta;
    }
    else {
        state = "tie";
        delta = 0;
    }
    account.hand += delta;
    await account.save();
    await btnCtx.update({
        embeds: [buildEmbed(playerHand, dealerHand, true, state, apuesta, delta, account.hand)],
        components: buildButtons(true),
    });
}
