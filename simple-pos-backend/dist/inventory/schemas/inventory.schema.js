"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventorySchema = exports.Inventory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const uuid_1 = require("uuid");
let Inventory = class Inventory {
};
exports.Inventory = Inventory;
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: uuid_1.v4 }),
    __metadata("design:type", String)
], Inventory.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Inventory.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Inventory.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", String)
], Inventory.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Inventory.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Inventory.prototype, "qty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Inventory.prototype, "isBillable", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Inventory.prototype, "price", void 0);
exports.Inventory = Inventory = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Inventory);
exports.InventorySchema = mongoose_1.SchemaFactory.createForClass(Inventory);
//# sourceMappingURL=inventory.schema.js.map