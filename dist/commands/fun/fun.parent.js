"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const seyfert_1 = require("seyfert");
const fun_achievements_1 = require("./fun.achievements");
const fun_captcha_1 = require("./fun.captcha");
let FunParent = class FunParent extends seyfert_1.Command {
};
FunParent = __decorate([
    (0, seyfert_1.Declare)({
        name: "diversión",
        description: "Comandos de diversión",
    }),
    (0, seyfert_1.Options)([
        fun_achievements_1.AchievementsCommand,
        fun_captcha_1.CaptchaCommand
    ])
], FunParent);
exports.default = FunParent;
