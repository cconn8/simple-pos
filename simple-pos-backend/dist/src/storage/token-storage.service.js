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
var TokenStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenStorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const storage_1 = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
let TokenStorageService = TokenStorageService_1 = class TokenStorageService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(TokenStorageService_1.name);
        this.fileName = 'xero-tokens.json';
        this.localTokenPath = path.join(process.cwd(), 'xero-tokens.json');
        const isDevelopment = this.configService.get('NODE_ENV') === 'development';
        this.logger.log(`🔧 Initializing TokenStorage - Environment: ${this.configService.get('NODE_ENV')}, isDevelopment: ${isDevelopment}`);
        if (!isDevelopment) {
            try {
                this.storage = new storage_1.Storage();
                this.bucketName = this.configService.get('GCP_STORAGE_BUCKET');
                this.logger.log(`📦 GCS bucket configured: ${this.bucketName}`);
                if (!this.bucketName) {
                    throw new Error('GCP_STORAGE_BUCKET environment variable is required for production');
                }
            }
            catch (error) {
                this.logger.error('Failed to initialize GCS Storage:', error);
                throw error;
            }
        }
    }
    async saveTokens(tokenSet) {
        try {
            this.logger.log('💾 Saving tokens...');
            this.logger.log(`🔍 Token details being saved: access_token exists: ${!!tokenSet.access_token}, refresh_token exists: ${!!tokenSet.refresh_token}`);
            const tokenData = JSON.stringify(tokenSet, null, 2);
            if (this.configService.get('NODE_ENV') === 'development') {
                fs.writeFileSync(this.localTokenPath, tokenData);
                this.logger.log('✅ Tokens saved to local file');
            }
            else {
                if (!this.storage || !this.bucketName) {
                    throw new Error('GCS Storage or bucket not properly configured');
                }
                const file = this.storage.bucket(this.bucketName).file(this.fileName);
                await file.save(tokenData, {
                    metadata: {
                        contentType: 'application/json',
                    },
                });
                this.logger.log('✅ Tokens saved to Cloud Storage');
                const [exists] = await file.exists();
                if (exists) {
                    this.logger.log('✅ Token save verified - file exists in GCS');
                }
                else {
                    this.logger.warn('⚠️ Token save verification failed - file not found in GCS');
                }
            }
        }
        catch (error) {
            this.logger.error('❌ Failed to save tokens:', error);
            throw error;
        }
    }
    async loadTokens() {
        try {
            const isDevelopment = this.configService.get('NODE_ENV') === 'development';
            this.logger.log(`🔍 Loading tokens - Environment: ${this.configService.get('NODE_ENV')}`);
            if (isDevelopment) {
                if (fs.existsSync(this.localTokenPath)) {
                    const tokenData = fs.readFileSync(this.localTokenPath, 'utf8');
                    const parsedTokens = JSON.parse(tokenData);
                    this.logger.log('✅ Tokens loaded from local file');
                    this.logger.log(`🔍 Token details: access_token exists: ${!!parsedTokens.access_token}, refresh_token exists: ${!!parsedTokens.refresh_token}`);
                    return parsedTokens;
                }
                this.logger.log('❌ No local token file found');
                return null;
            }
            else {
                this.logger.log(`🔄 Checking GCS bucket: ${this.bucketName}/${this.fileName}`);
                if (!this.storage || !this.bucketName) {
                    this.logger.error('❌ GCS Storage or bucket not properly configured');
                    return null;
                }
                const file = this.storage.bucket(this.bucketName).file(this.fileName);
                const [exists] = await file.exists();
                if (!exists) {
                    this.logger.log('❌ No tokens found in Cloud Storage');
                    return null;
                }
                const [contents] = await file.download();
                const tokenData = contents.toString();
                const parsedTokens = JSON.parse(tokenData);
                this.logger.log('✅ Tokens loaded from Cloud Storage');
                this.logger.log(`🔍 Token details: access_token exists: ${!!parsedTokens.access_token}, refresh_token exists: ${!!parsedTokens.refresh_token}`);
                if (parsedTokens.expires_at) {
                    const expiryDate = new Date(parsedTokens.expires_at * 1000);
                    const now = new Date();
                    const isExpired = now > expiryDate;
                    this.logger.log(`🕐 Token expiry: ${expiryDate.toISOString()}, Expired: ${isExpired}`);
                }
                return parsedTokens;
            }
        }
        catch (error) {
            this.logger.error('❌ Failed to load tokens:', error);
            if (error instanceof SyntaxError) {
                this.logger.error('❌ Token file appears to be corrupted (invalid JSON)');
            }
            return null;
        }
    }
    async deleteTokens() {
        try {
            this.logger.log('🧹 Deleting stored tokens...');
            if (this.configService.get('NODE_ENV') === 'development') {
                if (fs.existsSync(this.localTokenPath)) {
                    fs.unlinkSync(this.localTokenPath);
                    this.logger.log('✅ Local token file deleted');
                }
                else {
                    this.logger.log('ℹ️ No local token file to delete');
                }
            }
            else {
                if (!this.storage || !this.bucketName) {
                    throw new Error('GCS Storage or bucket not properly configured');
                }
                const file = this.storage.bucket(this.bucketName).file(this.fileName);
                const [exists] = await file.exists();
                if (exists) {
                    await file.delete();
                    this.logger.log('✅ Token file deleted from Cloud Storage');
                }
                else {
                    this.logger.log('ℹ️ No token file found in Cloud Storage to delete');
                }
            }
        }
        catch (error) {
            this.logger.error('❌ Failed to delete tokens:', error);
            throw error;
        }
    }
};
exports.TokenStorageService = TokenStorageService;
exports.TokenStorageService = TokenStorageService = TokenStorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TokenStorageService);
//# sourceMappingURL=token-storage.service.js.map