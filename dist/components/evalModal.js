"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seyfert_1 = require("seyfert");
class EvalModal extends seyfert_1.ModalCommand {
    filter(context) {
        return context.customId === 'eval';
    }
    async run(context) {
        const interaction = context.interaction;
        // estamos obteniendo los valores de los campos de texto pasando sus ID personalizados en el método `getInputValue`.
        const evalInput = interaction.getInputValue('evalInput', true);
        const passwordInput = interaction.getInputValue('passwordInput', true);
        if (passwordInput !== process.env.EVAL_PASSWORD) {
            return context.write({
                content: "Contraseña incorrecta"
            });
        }
        try {
            const embed = new seyfert_1.Embed()
                .setTitle("Eval")
                .addFields([
                { name: "Código", value: `\`\`\`ts\n${evalInput}\`\`\`` },
                { name: "Resultado", value: `\`\`\`ts\n${eval(evalInput.toString())}\`\`\`` }
            ])
                .setColor("Green");
            context.write({
                embeds: [embed]
            });
        }
        catch (error) {
            const embed = new seyfert_1.Embed()
                .setTitle("Error")
                .setDescription(`\`\`\`js\n${error}\`\`\``)
                .setColor("Red");
            context.write({
                embeds: [embed]
            });
        }
    }
}
exports.default = EvalModal;
