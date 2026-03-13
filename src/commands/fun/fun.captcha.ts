import { Declare, SubCommand, Options, createStringOption, type CommandContext } from "seyfert";

const options = {
    texto: createStringOption({
        description: "Texto del captcha",
        required: true
    }),
};

@Declare({
    name: "captcha",
    description: "Crea un captcha",
})
@Options(options)
export class CaptchaCommand extends SubCommand {
    async run(context: CommandContext<typeof options>) {
        const text = context.options.texto;
        const image = `https://api.alexflipnote.dev/captcha?text=${text.replaceAll(" ", "%20")}`;
        await context.write({
            content: image
        });
    }
}