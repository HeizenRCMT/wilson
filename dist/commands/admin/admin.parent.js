"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const seyfert_1 = require("seyfert");
const economy_add_1 = require("./economy.add");
const economy_set_1 = require("./economy.set");
const economy_substract_1 = require("./economy.substract");
const economy_reset_1 = require("./economy.reset");
const moderation_warn_1 = require("./moderation.warn");
const moderation_warnings_1 = require("./moderation.warnings");
const moderation_removewarn_1 = require("./moderation.removewarn");
let AdminParent = class AdminParent extends seyfert_1.Command {
};
AdminParent = __decorate([
    (0, seyfert_1.Declare)({
        name: "admin",
        description: "Comandos solo para administradores."
    }),
    (0, seyfert_1.Options)([
        economy_add_1.AdminAddCommand,
        economy_set_1.AdminSetCommand,
        economy_substract_1.AdminSubstractCommand,
        economy_reset_1.AdminResetCommand,
        moderation_warn_1.ModerationWarnCommand,
        moderation_warnings_1.ModerationWarningsCommand,
        moderation_removewarn_1.ModerationRemoveWarnCommand
    ]),
    (0, seyfert_1.Groups)({
        "economía": {
            defaultDescription: "Comandos de administrador de economía"
        },
        "moderación": {
            defaultDescription: "Comandos de administrador de moderación"
        }
    })
], AdminParent);
exports.default = AdminParent;
