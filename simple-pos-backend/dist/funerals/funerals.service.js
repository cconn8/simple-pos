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
exports.FuneralsService = void 0;
const common_1 = require("@nestjs/common");
const funeral_schema_1 = require("./schemas/funeral.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let FuneralsService = class FuneralsService {
    constructor(funeralModel) {
        this.funeralModel = funeralModel;
    }
    async create(data) {
        const funeral = await this.funeralModel.create({ formData: data });
        console.log("Saved funeral : ", funeral);
        return funeral;
    }
    async findAll() {
        const funerals = await this.funeralModel
            .find()
            .sort({ createdAt: -1 })
            .exec();
        if (!funerals || funerals.length === 0) {
            throw new common_1.NotFoundException(`No funerals found! Tasetfully returning 404!`);
        }
        return funerals;
    }
    async findOneById(id) {
        console.log('funerals service findOneById called');
        const funeral = await this.funeralModel.findById(id).exec();
        if (!funeral)
            throw new common_1.NotFoundException(`Funeral with id ${id} not found`);
        return funeral;
    }
    async findByIdAndUpdate(id, updateFuneralDto) {
        console.log('funerals service updateFuneralById called');
        return this.funeralModel.findByIdAndUpdate(id, updateFuneralDto, { new: true });
    }
    async deleteById(id) {
        const deleted = this.funeralModel.findByIdAndDelete(id);
        return deleted;
    }
};
exports.FuneralsService = FuneralsService;
exports.FuneralsService = FuneralsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(funeral_schema_1.Funeral.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FuneralsService);
//# sourceMappingURL=funerals.service.js.map