"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const seyfert_1 = require("seyfert");
const inventory_view_1 = require("./inventory.view");
const inventory_customize_1 = require("./inventory.customize");
const inventory_remove_1 = require("./inventory.remove");
let InventoryParent = class InventoryParent extends seyfert_1.Command {
};
InventoryParent = __decorate([
    (0, seyfert_1.Declare)({
        name: "inventario",
        description: "Gestiona tus objetos personales",
    }),
    (0, seyfert_1.Options)([inventory_view_1.InventoryViewCommand, inventory_customize_1.InventoryCustomizeCommand, inventory_remove_1.InventoryRemoveCommand])
], InventoryParent);
exports.default = InventoryParent;
