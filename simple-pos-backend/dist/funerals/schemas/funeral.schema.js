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
exports.FuneralSchema = exports.Funeral = exports.PaymentStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PAID"] = "Paid";
    PaymentStatus["PARTIALLY_PAID"] = "Partially Paid";
    PaymentStatus["UNPAID"] = "Unpaid";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let Funeral = class Funeral extends mongoose_2.Document {
};
exports.Funeral = Funeral;
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Funeral.prototype, "formData", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: PaymentStatus,
        default: PaymentStatus.UNPAID,
    }),
    __metadata("design:type", String)
], Funeral.prototype, "paymentStatus", void 0);
exports.Funeral = Funeral = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Funeral);
exports.FuneralSchema = mongoose_1.SchemaFactory.createForClass(Funeral);
//# sourceMappingURL=funeral.schema.js.map