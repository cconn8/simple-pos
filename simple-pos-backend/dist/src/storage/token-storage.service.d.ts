import { ConfigService } from '@nestjs/config';
export declare class TokenStorageService {
    private configService;
    private readonly logger;
    private readonly storage;
    private readonly bucketName;
    private readonly fileName;
    private readonly localTokenPath;
    constructor(configService: ConfigService);
    saveTokens(tokenSet: any): Promise<void>;
    loadTokens(): Promise<any | null>;
    deleteTokens(): Promise<void>;
}
