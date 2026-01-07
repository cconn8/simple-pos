"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthService = void 0;
const common_1 = require("@nestjs/common");
const google_auth_library_1 = require("google-auth-library");
const storage_1 = require("@google-cloud/storage");
let GoogleAuthService = class GoogleAuthService {
    async getClient() {
        const auth = new google_auth_library_1.GoogleAuth({
            scopes: [
                'https://www.googleapis.com/auth/devstorage.full_control',
                'https://www.googleapis.com/auth/cloud-platform',
            ],
        });
        return await auth.getClient();
    }
    async getStorage() {
        if (!this.storage) {
            const authClient = await this.getClient();
            this.storage = new storage_1.Storage({ authClient });
        }
        return this.storage;
    }
};
exports.GoogleAuthService = GoogleAuthService;
exports.GoogleAuthService = GoogleAuthService = __decorate([
    (0, common_1.Injectable)()
], GoogleAuthService);
//# sourceMappingURL=google-auth.service.js.map