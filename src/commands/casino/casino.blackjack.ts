import {
  Declare,
  SubCommand,
  type CommandContext,
  createIntegerOption,
  Options,
  Middlewares,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { Cooldown, CooldownType } from "@slipher/cooldown";
import Balance from "../../Schema/EconomySchema/Balance.Schema";
// ── Ayudantes de cartas ───────────────────────────────────────────────────────
const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
function buildDeck(): string[] {
  const deck: string[] = [];
  for (const suit of SUITS)
    for (const val of VALUES) deck.push(`${val}${suit}`);
  return deck;
}
function shuffle(deck: string[]): string[] {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}
function cardValue(card: string): number {
  const rank = card.replace(/[♠♥♦♣]/g, "");
  if (["J", "Q", "K"].includes(rank)) return 10;
  if (rank === "A") return 11;
  return parseInt(rank, 10);
}
function handScore(hand: string[]): number {
  let score = hand.reduce((sum, c) => sum + cardValue(c), 0);
  let aces = hand.filter((c) => c.startsWith("A")).length;
  while (score > 21 && aces-- > 0) score -= 10;
  return score;
}
// ── Constructor de embeds ─────────────────────────────────────────────────────
function buildEmbed(
  playerHand: string[],
  dealerHand: string[],
  dealerVisible: boolean,
  state: "playing" | "win" | "lose" | "bust" | "tie",
  apuesta: number,
  delta: number,
  balance: number
) {
  const playerScore = handScore(playerHand);
  const dealerScore = dealerVisible ? handScore(dealerHand) : cardValue(dealerHand[0]);
  const dealerDisplay = dealerVisible
    ? dealerHand.join("  ")
    : `${dealerHand[0]}  🂠`;
  const stateInfo: Record<string, { title: string; color: number; desc: string }> = {
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
          style: ButtonStyle.Success,
          label: "🃏 Pedir carta",
          custom_id: "bj_hit",
          disabled,
        },
        {
          type: 2,
          style: ButtonStyle.Danger,
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
  apuesta: createIntegerOption({
    description: "Cantidad de monedas a apostar",
    required: true,
    min_value: 1,
  }),
};
@Declare({
  name: "blackjack",
  description: "Juega al blackjack contra el dealer",
})
@Middlewares(["cooldown"])
@Cooldown({
  type: CooldownType.User,
  interval: 1000 * 15,
  uses: { default: 1 },
})
@Options(options)
export class BlackjackCommand extends SubCommand {
  async run(context: CommandContext<typeof options>) {
    const apuesta = context.options.apuesta;
    const account = await Balance.findOne({ userId: context.author.id });
    if (!account) {
      return context.write({
        content: "❌ No tienes cuenta. Usa `/economía cartera` para empezar.",
        flags: MessageFlags.Ephemeral,
      });
    }
    if (account.hand < apuesta) {
      return context.write({
        content: `❌ No tienes suficientes monedas. Tienes **${account.hand}**€`,
        flags: MessageFlags.Ephemeral,
      });
    }
    // Repartir cartas iniciales
    const deck = shuffle(buildDeck());
    const playerHand: string[] = [deck.pop()!, deck.pop()!];
    const dealerHand: string[] = [deck.pop()!, deck.pop()!];
    // Comprobar blackjack natural
    const playerBJ = handScore(playerHand) === 21;
    const dealerBJ = handScore(dealerHand) === 21;
    if (playerBJ || dealerBJ) {
      let state: "win" | "lose" | "tie";
      let delta = 0;
      if (playerBJ && dealerBJ) {
        state = "tie";
        delta = 0;
      } else if (playerBJ) {
        state = "win";
        delta = Math.floor(apuesta * 1.5); // BJ paga 3:2
      } else {
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
    const msg = await context.write(
      {
        embeds: [buildEmbed(playerHand, dealerHand, false, "playing", apuesta, 0, account.hand)],
        components: buildButtons(),
      },
      true
    );
    if (!msg) return;
    const collector = msg.createComponentCollector({ idle: 60_000 });
    collector.run<import("seyfert").ButtonInteraction>(["bj_hit", "bj_stand"], async (btnCtx) => {
      // Solo permitir al jugador original
      if (btnCtx.user.id !== context.author.id) {
        await btnCtx.write({
          content: "❌ Este no es tu juego.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      if (btnCtx.customId === "bj_hit") {
        playerHand.push(deck.pop()!);
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
        } else if (score === 21) {
          // Plantarse automáticamente al llegar a 21
          collector.stop("stand");
          await resolveStand(btnCtx, playerHand, dealerHand, deck, apuesta, account);
        } else {
          // Todavía jugando
          await btnCtx.update({
            embeds: [buildEmbed(playerHand, dealerHand, false, "playing", apuesta, 0, account.hand)],
            components: buildButtons(),
          });
        }
      } else {
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
  onMiddlewaresError(context: CommandContext, error: string) {
    context.editOrReply({ content: error });
  }
}
// ── Resolución del dealer (plantarse) ─────────────────────────────────────────
async function resolveStand(
  btnCtx: import("seyfert").ButtonInteraction,
  playerHand: string[],
  dealerHand: string[],
  deck: string[],
  apuesta: number,
  account: InstanceType<typeof Balance>
) {
  // El dealer pide hasta tener 17 o más
  while (handScore(dealerHand) < 17) {
    dealerHand.push(deck.pop()!);
  }
  const playerScore = handScore(playerHand);
  const dealerScore = handScore(dealerHand);
  let state: "win" | "lose" | "tie";
  let delta = 0;
  if (dealerScore > 21 || playerScore > dealerScore) {
    state = "win";
    delta = apuesta;
  } else if (playerScore < dealerScore) {
    state = "lose";
    delta = -apuesta;
  } else {
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