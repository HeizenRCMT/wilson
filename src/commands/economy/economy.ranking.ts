import { Declare, SubCommand, Embed, type CommandContext } from "seyfert";
import Balance from "../../Schema/EconomySchema/Balance.Schema";

@Declare({
    name: "ranking",
    description: "Muestra la tabla de clasificación de la economía",
})
export class LeaderboardCommand extends SubCommand {
    async run(context: CommandContext) {
        const topUsers = await Balance.aggregate([
            {
                $addFields: {
                    total: { $add: ["$hand", "$bank"] }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 10 }
        ]);

        if (topUsers.length === 0) {
            return context.write({
                content: "No hay datos de economía todavía."
            });
        }

        const embed = new Embed()
            .setTitle("🏆 Tabla de Clasificación")
            .setColor("Gold")
            .setDescription("Los 10 usuarios más ricos del servidor.");

        for (let i = 0; i < topUsers.length; i++) {
            const data = topUsers[i];
            const userId = data.userId;
            const user = await context.client.users.fetch(userId).catch(() => null);
            const username = user ? user.username : `Usuario Desconocido (${userId})`;

            embed.addFields([{
                name: `${i + 1}. ${username}`,
                value: `💰 Total: **${data.total.toLocaleString()}** (Mano: ${data.hand.toLocaleString()} | Banco: ${data.bank.toLocaleString()})`,
                inline: false
            }]);
        }

        return context.write({
            embeds: [embed]
        });
    }
}
