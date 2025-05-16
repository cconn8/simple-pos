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
let FuneralsModule = class FuneralsModule {
};
exports.FuneralsModule = FuneralsModule;
exports.FuneralsModule = FuneralsModule = __decorate([
    (0, common_1.Module)({
        controllers: [funerals_controller_1.FuneralsController],
        providers: [funerals_service_1.FuneralsService],
    })
], FuneralsModule);
//# sourceMappingURL=funerals.module.js.map