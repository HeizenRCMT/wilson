"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInfoCommand = void 0;
const seyfert_1 = require("seyfert");
let ServerInfoCommand = class ServerInfoCommand extends seyfert_1.SubCommand {
    async run(context) {
        const guild = await context.guild();
        const embed = new seyfert_1.Embed()
            .setTitle("Información del servidor")
            .addFields([
            { name: "Nombre:", value: `${guild?.name}` },
            { name: "ID:", value: `${context.guildId}` },
            { name: "Dueño:", value: `${guild?.owner}` },
            { name: "Miembros:", value: `${guild?.memberCount}` },
            { name: "Creado en:", value: `${guild?.createdAt}` },
            { name: "", value: `` },
        ])
            .setThumbnail(`${guild?.iconURL()}`)
            .setColor("Blurple");
        context.write({
            embeds: [embed]
        });
    }
};
exports.ServerInfoCommand = ServerInfoCommand;
exports.ServerInfoCommand = ServerInfoCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "servidor",
        description: "Información sobre el servidor"
    })
], ServerInfoCommand);
