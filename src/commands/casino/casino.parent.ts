import { Declare, Command, Options } from "seyfert";
import { BlackjackCommand } from "./casino.blackjack";
import { RouletteCommand } from "./casino.roulette";
import { PokerCommand } from "./casino.poker";

const subcommands = [BlackjackCommand, RouletteCommand, PokerCommand] as const;

@Declare({
  name: "casino",
  description: "🎰 Juegos de casino",
})
@Options([...subcommands])
export default class CasinoParent extends Command {}
