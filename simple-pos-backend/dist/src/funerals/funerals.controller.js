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
var FuneralsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuneralsController = void 0;
const common_1 = require("@nestjs/common");
const funerals_service_1 = require("./funerals.service");
const create_funeral_dto_1 = require("./dto/create-funeral.dto");
const update_funeral_dto_1 = require("./dto/update-funeral.dto");
const invoice_service_1 = require("../invoice/invoice.service");
const auth_guard_1 = require("../auth/auth.guard");
const xero_service_1 = require("../xero/xero.service");
let FuneralsController = FuneralsController_1 = class FuneralsController {
    constructor(funeralsService, invoiceService, xeroService) {
        this.funeralsService = funeralsService;
        this.invoiceService = invoiceService;
        this.xeroService = xeroService;
        this.logger = new common_1.Logger(FuneralsController_1.name);
    }
    async create(createFuneralDto) {
        this.logger.log('📝 Creating new funeral record');
        const funeral = await this.funeralsService.create(createFuneralDto);
        this.logger.log(`✅ Funeral created successfully: ${funeral._id}`);
        return funeral;
    }
    async findAll() {
        this.logger.log('📋 Fetching all funeral records');
        const funerals = await this.funeralsService.findAll();
        this.logger.log(`✅ Retrieved ${funerals.length} funeral records`);
        return funerals;
    }
    findOneById(id) {
        return this.funeralsService.findOneById(id);
    }
    async update(id, updateFuneralDto) {
        const updatedFuneral = await this.funeralsService.findByIdAndUpdate(id, updateFuneralDto);
        return updatedFuneral;
    }
    async remove(id, body) {
        const { invoiceUrl } = body;
        if (invoiceUrl) {
            await this.invoiceService.deleteFileGCS(invoiceUrl);
        }
        return this.funeralsService.deleteById(id);
    }
    async postToXero(id, postingData) {
        try {
            this.logger.log(`💼 Starting Xero posting for funeral: ${id}`);
            const funeral = await this.funeralsService.findOneById(id);
            if (!funeral) {
                this.logger.error(`❌ Funeral not found: ${id}`);
                return {
                    success: false,
                    error: 'Funeral record not found'
                };
            }
            if (funeral.xeroData?.invoiceId) {
                this.logger.warn(`⚠️ Funeral ${id} already posted to Xero`);
                return {
                    success: false,
                    error: 'This funeral has already been posted to XERO',
                    existingData: funeral.xeroData
                };
            }
            this.logger.log(`🔄 Posting to Xero...`);
            const result = await this.xeroService.postFuneralToXero(postingData);
            if (result.success) {
                this.logger.log(`✅ Xero posting successful - updating funeral record`);
                const xeroData = {
                    contactId: result.contactId,
                    invoiceId: result.invoiceId,
                    invoiceUrl: result.invoiceUrl,
                    status: 'posted',
                    postedAt: new Date().toISOString()
                };
                await this.funeralsService.findByIdAndUpdateUsingMongoCommand(id, {
                    $set: { xeroData: xeroData }
                });
                return {
                    success: true,
                    message: 'Successfully posted to XERO',
                    xeroData: xeroData
                };
            }
            else if (result.isDuplicateInvoice) {
                return {
                    success: false,
                    isDuplicateInvoice: true,
                    duplicateInvoiceNumber: result.duplicateInvoiceNumber,
                    error: result.error
                };
            }
            else {
                return {
                    success: false,
                    error: result.error || 'Failed to post to XERO'
                };
            }
        }
        catch (error) {
            console.error('XERO posting error:', error);
            return {
                success: false,
                error: error.message || 'Internal server error during XERO posting'
            };
        }
    }
    async markAsPosted(id, postingData) {
        try {
            const funeral = await this.funeralsService.findOneById(id);
            if (!funeral) {
                return {
                    success: false,
                    error: 'Funeral record not found'
                };
            }
            const contactData = {
                name: postingData.contactName,
                emailAddress: postingData.contactEmail,
                phones: postingData.contactPhone ? [{ phoneType: 'DEFAULT', phoneNumber: postingData.contactPhone }] : [],
                addresses: postingData.addressLine1 ? [{
                        addressType: 'POBOX',
                        addressLine1: postingData.addressLine1,
                        addressLine2: postingData.addressLine2,
                        city: postingData.city,
                        region: postingData.region,
                        postalCode: postingData.postalCode,
                        country: postingData.country || 'Ireland'
                    }] : []
            };
            const result = await this.xeroService.markAsPosted(contactData, postingData.invoiceNumber);
            if (result.success) {
                const xeroData = {
                    contactId: result.contactId,
                    invoiceId: result.invoiceId,
                    invoiceUrl: result.invoiceUrl,
                    status: 'posted',
                    postedAt: new Date().toISOString(),
                    isExistingInvoice: true
                };
                await this.funeralsService.findByIdAndUpdateUsingMongoCommand(id, {
                    $set: { xeroData: xeroData }
                });
                return {
                    success: true,
                    message: `Marked as posted to existing XERO invoice #${postingData.invoiceNumber}`,
                    xeroData: xeroData
                };
            }
            else {
                return {
                    success: false,
                    error: result.error || 'Failed to mark as posted to XERO'
                };
            }
        }
        catch (error) {
            console.error('Mark as posted error:', error);
            return {
                success: false,
                error: error.message || 'Internal server error while marking as posted'
            };
        }
    }
    async resetXeroData(id) {
        try {
            await this.funeralsService.findByIdAndUpdateUsingMongoCommand(id, {
                $unset: { xeroData: 1 }
            });
            return {
                success: true,
                message: 'XERO data cleared. You can now post to XERO again.'
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Failed to reset XERO data'
            };
        }
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
    __metadata("design:returntype", Promise)
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
    __metadata("design:returntype", Promise)
], FuneralsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FuneralsController.prototype, "remove", null);
__decorate([
    (0, common_1.SetMetadata)('skipAuth', true),
    (0, common_1.Post)(':id/xero/post'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FuneralsController.prototype, "postToXero", null);
__decorate([
    (0, common_1.SetMetadata)('skipAuth', true),
    (0, common_1.Post)(':id/xero/mark-posted'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FuneralsController.prototype, "markAsPosted", null);
__decorate([
    (0, common_1.SetMetadata)('skipAuth', true),
    (0, common_1.Delete)(':id/xero/reset'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FuneralsController.prototype, "resetXeroData", null);
exports.FuneralsController = FuneralsController = FuneralsController_1 = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('funerals'),
    __metadata("design:paramtypes", [funerals_service_1.FuneralsService,
        invoice_service_1.InvoiceService,
        xero_service_1.XeroService])
], FuneralsController);
//# sourceMappingURL=funerals.controller.js.map