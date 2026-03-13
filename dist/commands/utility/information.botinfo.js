"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotInfoCommand = void 0;
const seyfert_1 = require("seyfert");
let BotInfoCommand = class BotInfoCommand extends seyfert_1.SubCommand {
    async run(context) {
        const embed = new seyfert_1.Embed()
            .setTitle("¿Quién soy?")
            .setDescription("Soy el bot oficial de este servidor, creado por HeizenRC con ayuda de los administradores.")
            .addFields([
            { name: "Nombre:", value: "Wilson" },
            { name: "ID:", value: `${context.client.botId}` },
            { name: "Prefix:", value: `$` },
            { name: "Ayudas especiales:", value: ["flacidpankake", "john_gato", "corbacho_77", "noctyfruitt\_", "nombren.t", "tony_r3c", "izan_el_cocotero"].join(", ") },
        ])
            .setColor("Blurple");
        context.write({
            embeds: [embed]
        });
    }
};
exports.BotInfoCommand = BotInfoCommand;
exports.BotInfoCommand = BotInfoCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "botinfo",
        description: "Información sobre el bot"
    })
], BotInfoCommand);
