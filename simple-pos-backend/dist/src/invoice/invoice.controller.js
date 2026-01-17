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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const invoice_service_1 = require("./invoice.service");
const common_2 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
let InvoiceController = class InvoiceController {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async generateInvoice(id, body) {
        console.log('Received invoice request for funeral ID:', id);
        console.log('Payload body:', JSON.stringify(body, null, 2));
        try {
            const url = await this.invoiceService.generateInvoice(id, body);
            console.log('Invoice URL generated:', url);
            return url;
        }
        catch (error) {
            console.error('Error generating invoice:', error.message);
            console.error(error.stack);
            throw new common_2.InternalServerErrorException('Failed to generate invoice.');
        }
    }
    async deleteInvoice(body) {
        console.log('Received delete invoice request:', body);
        try {
            const { funeralId, invoiceUrl } = body;
            await this.invoiceService.deleteFileGCS(invoiceUrl);
            console.log('Invoice file deleted from storage');
            await this.invoiceService.clearInvoiceFromDatabase(funeralId);
            console.log('Invoice URL cleared from database');
            return {
                success: true,
                message: 'Invoice deleted successfully'
            };
        }
        catch (error) {
            console.error('Error deleting invoice:', error.message);
            console.error(error.stack);
            throw new common_2.InternalServerErrorException('Failed to delete invoice.');
        }
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, common_1.Post)(':funeral_id'),
    __param(0, (0, common_1.Param)('funeral_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "generateInvoice", null);
__decorate([
    (0, common_1.Delete)('delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "deleteInvoice", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('invoice'),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map