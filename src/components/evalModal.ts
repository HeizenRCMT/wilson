import { ModalCommand, type ModalContext, Embed } from 'seyfert';

export default class EvalModal extends ModalCommand {
  filter(context: ModalContext) {
    return context.customId === 'eval';
  }

  async run(context: ModalContext) {
    const interaction = context.interaction;

    // estamos obteniendo los valores de los campos de texto pasando sus ID personalizados en el método `getInputValue`.

    const evalInput = interaction.getInputValue('evalInput', true);

    const passwordInput = interaction.getInputValue('passwordInput', true);

    if (passwordInput !== process.env.EVAL_PASSWORD) {
        return context.write({
            content: "Contraseña incorrecta"
        })
    }

    try {
        const embed = new Embed()
            .setTitle("Eval")
            .addFields([
                { name: "Código", value: `\`\`\`ts\n${evalInput}\`\`\`` },
                { name: "Resultado", value: `\`\`\`ts\n${eval(evalInput.toString())}\`\`\`` }
            ])
            .setColor("Green");
        context.write({
            embeds: [embed]
        });
    } catch (error) {
        const embed = new Embed()
            .setTitle("Error")
            .setDescription(`\`\`\`js\n${error}\`\`\``)
            .setColor("Red");
        context.write({
            embeds: [embed]
        });
    }
  }
}