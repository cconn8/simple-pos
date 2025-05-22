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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuneralsController = void 0;
const common_1 = require("@nestjs/common");
const funerals_service_1 = require("./funerals.service");
const create_funeral_dto_1 = require("./dto/create-funeral.dto");
const update_funeral_dto_1 = require("./dto/update-funeral.dto");
let FuneralsController = class FuneralsController {
    constructor(funeralsService) {
        this.funeralsService = funeralsService;
    }
    async create(createFuneralDto) {
        const funeral = await this.funeralsService.create(createFuneralDto);
        return { id: funeral._id, message: 'Funeral created successfully!' };
    }
    findAll() {
        return this.funeralsService.findAll();
    }
    findOneById(id) {
        return this.funeralsService.findOneById(id);
    }
    update(id, updateFuneralDto) {
        return this.funeralsService.update(+id, updateFuneralDto);
    }
    remove(id) {
        return this.funeralsService.remove(+id);
    }
};
exports.FuneralsController = FuneralsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_funeral_dto_1.CreateFuneralDto]),
    __metadata("design:returntype", Promise)
], FuneralsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FuneralsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FuneralsController.prototype, "findOneById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_funeral_dto_1.UpdateFuneralDto]),
    __metadata("design:returntype", void 0)
], FuneralsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FuneralsController.prototype, "remove", null);
exports.FuneralsController = FuneralsController = __decorate([
    (0, common_1.Controller)('funerals'),
    __metadata("design:paramtypes", [funerals_service_1.FuneralsService])
], FuneralsController);
//# sourceMappingURL=funerals.controller.js.map