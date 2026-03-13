"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoCommand = void 0;
const seyfert_1 = require("seyfert");
const options = {
    usuario: (0, seyfert_1.createUserOption)({
        description: "Usuario del cual quieres información",
        required: false
    })
};
let UserInfoCommand = class UserInfoCommand extends seyfert_1.SubCommand {
    async run(context) {
        const member = context.options.usuario || context.author;
        const embed = new seyfert_1.Embed()
            .setTitle("Información de: " + member.username)
            .addFields([
            { name: "Nombre:", value: member.username },
            { name: "ID:", value: member.id },
            { name: "¿Es un bot?", value: member.bot ? "Sí" : "No" },
            { name: "¿Es dueño del servidor?", value: member.id === "1119575096084926505" ? "Sí" : "No" },
            { name: "¿Es dueño del bot?", value: member.id === "709770108863643649" ? "Sí" : "No" },
            { name: "Test", value: `${member.flags?.toString()}` },
            { name: "", value: `` },
        ])
            .setThumbnail(`${member.avatarURL()}`)
            .setDescription("Banner:")
            .setImage(`${member.bannerURL() || "https://static.beebom.com/wp-content/uploads/2022/01/discord-nitro-body.jpg?w=640"}`)
            .setColor("Blurple");
        context.write({
            embeds: [embed]
        });
    }
};
exports.UserInfoCommand = UserInfoCommand;
exports.UserInfoCommand = UserInfoCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "usuario",
        description: "Te da información de un usuario"
    }),
    (0, seyfert_1.Options)(options)
], UserInfoCommand);
