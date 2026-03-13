"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const seyfert_1 = require("seyfert");
const types_1 = require("seyfert/lib/types");
let EvalCommand = class EvalCommand extends seyfert_1.Command {
    async run(context) {
        const evalInput = new seyfert_1.TextInput()
            .setPlaceholder("El código")
            .setCustomId("evalInput")
            .setStyle(types_1.TextInputStyle.Paragraph)
            .setRequired(true);
        const passwordInput = new seyfert_1.TextInput()
            .setPlaceholder("La contraseña")
            .setCustomId("passwordInput")
            .setStyle(types_1.TextInputStyle.Short)
            .setRequired(true);
        const label1 = new seyfert_1.Label()
            .setLabel("Contraseña:")
            .setComponent(passwordInput);
        const label2 = new seyfert_1.Label()
            .setLabel("Código:")
            .setComponent(evalInput);
        const modal = new seyfert_1.Modal()
            .setTitle("Evaluación de comando")
            .setCustomId("eval")
            .addComponents([label2, label1]);
        context.interaction.modal(modal);
    }
};
EvalCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "eval",
        description: "Evalúa código"
    })
], EvalCommand);
exports.default = EvalCommand;
