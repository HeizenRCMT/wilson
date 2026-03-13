"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementsCommand = void 0;
const seyfert_1 = require("seyfert");
const options = {
    texto: (0, seyfert_1.createStringOption)({
        description: "Texto del logro",
        required: true
    }),
    icono: (0, seyfert_1.createStringOption)({
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
let AchievementsCommand = class AchievementsCommand extends seyfert_1.SubCommand {
    async run(context) {
        const icon = context.options.icono;
        const text = context.options.texto;
        const image = `https://api.alexflipnote.dev/achievement?text=${text.replaceAll(" ", "%20")}&icon=${icon}`;
        await context.write({
            content: image
        });
    }
};
exports.AchievementsCommand = AchievementsCommand;
exports.AchievementsCommand = AchievementsCommand = __decorate([
    (0, seyfert_1.Declare)({
        name: "logro",
        description: "Crea un logro como en minecraft",
    }),
    (0, seyfert_1.Options)(options)
], AchievementsCommand);
