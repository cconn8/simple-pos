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
var XeroController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XeroController = void 0;
const common_1 = require("@nestjs/common");
const xero_service_1 = require("./xero.service");
let XeroController = XeroController_1 = class XeroController {
    constructor(xeroService) {
        this.xeroService = xeroService;
        this.logger = new common_1.Logger(XeroController_1.name);
    }
    async connect(res) {
        try {
            const authUrl = await this.xeroService.getAuthorizationUrl();
            this.logger.log('🚀 Starting Xero OAuth flow - redirecting to authorization URL');
            return res.redirect(authUrl);
        }
        catch (error) {
            this.logger.error('Failed to start XERO OAuth flow', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to start XERO authentication'
            });
        }
    }
    async callback(query, res) {
        try {
            const fullUrl = `${process.env.XERO_REDIRECT_URI}?${new URLSearchParams(query).toString()}`;
            const success = await this.xeroService.handleOAuthCallback(fullUrl);
            if (success) {
                this.logger.log('✅ Xero OAuth authentication successful - redirecting to frontend');
                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?xero_auth=success`);
            }
            else {
                this.logger.error('❌ Xero OAuth authentication failed - redirecting to frontend');
                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?xero_auth=error`);
            }
        }
        catch (error) {
            this.logger.error('XERO OAuth callback error', error);
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?xero_auth=error`);
        }
    }
    async status() {
        try {
            const isAuthenticated = await this.xeroService.isAuthenticated();
            this.logger.log(`🔍 Xero status check: ${isAuthenticated ? 'Connected' : 'Not connected'}`);
            return {
                success: true,
                authenticated: isAuthenticated,
                message: isAuthenticated ? 'XERO is connected' : 'XERO authentication required'
            };
        }
        catch (error) {
            this.logger.error('Failed to check XERO status', error);
            return {
                success: false,
                authenticated: false,
                error: 'Failed to check XERO authentication status'
            };
        }
    }
    async disconnect() {
        try {
            await this.xeroService.clearTokens();
            this.logger.log('🧹 XERO tokens cleared successfully');
            return {
                success: true,
                message: 'XERO tokens cleared. Re-authentication required.'
            };
        }
        catch (error) {
            this.logger.error('Failed to clear XERO tokens', error);
            return {
                success: false,
                error: 'Failed to clear XERO tokens'
            };
        }
    }
};
exports.XeroController = XeroController;
__decorate([
    (0, common_1.Get)('connect'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], XeroController.prototype, "connect", null);
__decorate([
    (0, common_1.Get)('callback'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], XeroController.prototype, "callback", null);
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], XeroController.prototype, "status", null);
__decorate([
    (0, common_1.Get)('disconnect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], XeroController.prototype, "disconnect", null);
exports.XeroController = XeroController = XeroController_1 = __decorate([
    (0, common_1.Controller)('auth/xero'),
    __metadata("design:paramtypes", [xero_service_1.XeroService])
], XeroController);
//# sourceMappingURL=xero.controller.js.map