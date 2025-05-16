"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuneralsService = void 0;
const common_1 = require("@nestjs/common");
let FuneralsService = class FuneralsService {
    create(createFuneralDto) {
        console.log('Server here! Your funeral object was received : ', createFuneralDto);
        return Response.json({ success: true, message: "Funeral Service Added Successfully" });
    }
    findAll() {
        return Response.json({ success: true, message: `This action returns all funerals` });
    }
    findOne(id) {
        return `This action returns a #${id} funeral`;
    }
    update(id, updateFuneralDto) {
        return `This action updates a #${id} funeral`;
    }
    remove(id) {
        return `This action removes a #${id} funeral`;
    }
};
exports.FuneralsService = FuneralsService;
exports.FuneralsService = FuneralsService = __decorate([
    (0, common_1.Injectable)()
], FuneralsService);
//# sourceMappingURL=funerals.service.js.map