"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceModule = void 0;
const common_1 = require("@nestjs/common");
const invoice_service_1 = require("./invoice.service");
const invoice_controller_1 = require("./invoice.controller");
const funerals_module_1 = require("../funerals/funerals.module");
const google_auth_service_1 = require("../google/google-auth.service");
const google_module_1 = require("../google/google.module");
let InvoiceModule = class InvoiceModule {
};
exports.InvoiceModule = InvoiceModule;
exports.InvoiceModule = InvoiceModule = __decorate([
    (0, common_1.Module)({
        providers: [invoice_service_1.InvoiceService, google_auth_service_1.GoogleAuthService],
        controllers: [invoice_controller_1.InvoiceController],
        imports: [
            google_module_1.GoogleModule,
            (0, common_1.forwardRef)(() => funerals_module_1.FuneralsModule)
        ],
        exports: [invoice_service_1.InvoiceService]
    })
], InvoiceModule);
//# sourceMappingURL=invoice.module.js.map