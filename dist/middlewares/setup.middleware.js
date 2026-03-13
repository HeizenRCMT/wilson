"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewares = void 0;
const middleware_cooldown_1 = __importDefault(require("./plugins/middleware.cooldown"));
const middleware_onlydev_1 = __importDefault(require("./plugins/middleware.onlydev"));
const middleware_onlyadmin_1 = __importDefault(require("./plugins/middleware.onlyadmin"));
exports.middlewares = {
    cooldown: middleware_cooldown_1.default,
    onlyDev: middleware_onlydev_1.default,
    onlyAdmin: middleware_onlyadmin_1.default
};
