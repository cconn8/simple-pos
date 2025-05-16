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
exports.FormTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const form_templates_service_1 = require("./form-templates.service");
const create_form_template_dto_1 = require("./dto/create-form-template.dto");
const update_form_template_dto_1 = require("./dto/update-form-template.dto");
let FormTemplatesController = class FormTemplatesController {
    constructor(formTemplatesService) {
        this.formTemplatesService = formTemplatesService;
    }
    create(createFormTemplateDto) {
        return this.formTemplatesService.create(createFormTemplateDto);
    }
    findAll() {
        return this.formTemplatesService.findAll();
    }
    findOne(id) {
        return this.formTemplatesService.findOne(+id);
    }
    update(id, updateFormTemplateDto) {
        return this.formTemplatesService.update(+id, updateFormTemplateDto);
    }
    remove(id) {
        return this.formTemplatesService.remove(+id);
    }
};
exports.FormTemplatesController = FormTemplatesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_form_template_dto_1.CreateFormTemplateDto]),
    __metadata("design:returntype", void 0)
], FormTemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormTemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormTemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_form_template_dto_1.UpdateFormTemplateDto]),
    __metadata("design:returntype", void 0)
], FormTemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormTemplatesController.prototype, "remove", null);
exports.FormTemplatesController = FormTemplatesController = __decorate([
    (0, common_1.Controller)('form-templates'),
    __metadata("design:paramtypes", [form_templates_service_1.FormTemplatesService])
], FormTemplatesController);
//# sourceMappingURL=form-templates.controller.js.map