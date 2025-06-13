import { Injectable } from '@nestjs/common';
import { GoogleAuth, AuthClient } from 'google-auth-library';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class GoogleAuthService {
  private storage: Storage;

  async getClient(): Promise<AuthClient> {
    const auth = new GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/devstorage.full_control',
        'https://www.googleapis.com/auth/cloud-platform'
      ],
    });

    return await auth.getClient(); // AuthClient is the correct type
  }

  async getStorage(): Promise<Storage> {
    if (!this.storage) {
      const authClient = await this.getClient();
      this.storage = new Storage({ authClient });
    }
    return this.storage;
  }
}
