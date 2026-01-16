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
        if (!isDevelopment) {
            this.storage = new storage_1.Storage();
            this.bucketName = this.configService.get('GCP_STORAGE_BUCKET');
            if (!this.bucketName) {
                throw new Error('GCP_STORAGE_BUCKET environment variable is required for production');
            }
        }
    }
    async saveTokens(tokenSet) {
        try {
            const tokenData = JSON.stringify(tokenSet, null, 2);
            if (this.configService.get('NODE_ENV') === 'development') {
                fs.writeFileSync(this.localTokenPath, tokenData);
                this.logger.log('Tokens saved to local file');
            }
            else {
                const file = this.storage.bucket(this.bucketName).file(this.fileName);
                await file.save(tokenData, {
                    metadata: {
                        contentType: 'application/json',
                    },
                });
                this.logger.log('Tokens saved to Cloud Storage');
            }
        }
        catch (error) {
            this.logger.error('Failed to save tokens', error);
            throw error;
        }
    }
    async loadTokens() {
        try {
            if (this.configService.get('NODE_ENV') === 'development') {
                if (fs.existsSync(this.localTokenPath)) {
                    const tokenData = fs.readFileSync(this.localTokenPath, 'utf8');
                    this.logger.log('Tokens loaded from local file');
                    return JSON.parse(tokenData);
                }
                return null;
            }
            else {
                const file = this.storage.bucket(this.bucketName).file(this.fileName);
                const [exists] = await file.exists();
                if (!exists) {
                    this.logger.log('No tokens found in Cloud Storage');
                    return null;
                }
                const [contents] = await file.download();
                const tokenData = contents.toString();
                this.logger.log('Tokens loaded from Cloud Storage');
                return JSON.parse(tokenData);
            }
        }
        catch (error) {
            this.logger.error('Failed to load tokens', error);
            return null;
        }
    }
};
exports.TokenStorageService = TokenStorageService;
exports.TokenStorageService = TokenStorageService = TokenStorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TokenStorageService);
//# sourceMappingURL=token-storage.service.js.map