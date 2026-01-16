"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuneralsModule = void 0;
const common_1 = require("@nestjs/common");
const funerals_service_1 = require("./funerals.service");
const funerals_controller_1 = require("./funerals.controller");
const mongoose_1 = require("@nestjs/mongoose");
const funeral_schema_1 = require("./schemas/funeral.schema");
const invoice_module_1 = require("../invoice/invoice.module");
const invoice_service_1 = require("../invoice/invoice.service");
const google_module_1 = require("../google/google.module");
const xero_module_1 = require("../xero/xero.module");
let FuneralsModule = class FuneralsModule {
};
exports.FuneralsModule = FuneralsModule;
exports.FuneralsModule = FuneralsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: funeral_schema_1.Funeral.name, schema: funeral_schema_1.FuneralSchema }]),
            google_module_1.GoogleModule,
            (0, common_1.forwardRef)(() => invoice_module_1.InvoiceModule),
            xero_module_1.XeroModule,
        ],
        controllers: [funerals_controller_1.FuneralsController],
        providers: [funerals_service_1.FuneralsService, invoice_service_1.InvoiceService],
        exports: [funerals_service_1.FuneralsService],
    })
], FuneralsModule);
//# sourceMappingURL=funerals.module.js.map