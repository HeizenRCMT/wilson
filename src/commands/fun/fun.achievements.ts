import { Declare, SubCommand, Options, createStringOption, type CommandContext } from "seyfert";

const options = {
    texto: createStringOption({
        description: "Texto del logro",
        required: true
    }),
    icono: createStringOption({
        description: "Icono del logro",
        choices: [
            { name: "Diamante", value: `2` },
            { name: "Creeper", value: `4` },
            { name: "TNT", value: `6` },
            { name: "Galleta", value: `7` },
            { name: "Corazón", value: `8` },
            { name: "Cama", value: "9" },
            { name: "Tarta", value: "10" },
            { name: "Fuego", value: "15" },
            { name: "Cubeta", value: "36" },
            { name: "Agua", value: "37" },
            { name: "Lava", value: "38" },
            { name: "Leche", value: "39" },
        ],
        required: true
    })
};

@Declare({
    name: "logro",
    description: "Crea un logro como en minecraft",
})
@Options(options)
export class AchievementsCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const icon = context.options.icono;
        const text = context.options.texto;
        const image = `https://api.alexflipnote.dev/achievement?text=${text.replaceAll(" ", "%20")}&icon=${icon}`;
        await context.write({
            content: image
        });
    }
}