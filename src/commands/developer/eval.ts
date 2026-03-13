import { Declare, Command, type CommandContext, Modal, Label, TextInput } from "seyfert";
import { TextInputStyle } from "seyfert/lib/types";

@Declare({
    name: "eval",
    description: "Evalúa código"
})
export default class EvalCommand extends Command {
    async run(context: CommandContext) {
        const evalInput = new TextInput()
            .setPlaceholder("El código")
            .setCustomId("evalInput")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
        const passwordInput = new TextInput()
            .setPlaceholder("La contraseña")
            .setCustomId("passwordInput")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const label1 = new Label()
        .setLabel("Contraseña:")
        .setComponent(passwordInput)
        const label2 = new Label()
        .setLabel("Código:")
        .setComponent(evalInput)
        const modal = new Modal()
            .setTitle("Evaluación de comando")
            .setCustomId("eval")
            .addComponents([label2, label1])

        context.interaction.modal(modal)
    }
}