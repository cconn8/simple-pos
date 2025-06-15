import { AuthClient } from 'google-auth-library';
import { Storage } from '@google-cloud/storage';
export declare class GoogleAuthService {
    private storage;
    getClient(): Promise<AuthClient>;
    getStorage(): Promise<Storage>;
}
