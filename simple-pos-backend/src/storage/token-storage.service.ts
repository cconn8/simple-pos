import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TokenStorageService {
  private readonly logger = new Logger(TokenStorageService.name);
  private readonly storage: Storage;
  private readonly bucketName: string;
  private readonly fileName = 'xero-tokens.json';
  private readonly localTokenPath = path.join(process.cwd(), 'xero-tokens.json');

  constructor(private configService: ConfigService) {
    const isDevelopment = this.configService.get('NODE_ENV') === 'development';
    this.logger.log(`🔧 Initializing TokenStorage - Environment: ${this.configService.get('NODE_ENV')}, isDevelopment: ${isDevelopment}`);
    
    if (!isDevelopment) {
      try {
        this.storage = new Storage();
        this.bucketName = this.configService.get('GCP_STORAGE_BUCKET');
        this.logger.log(`📦 GCS bucket configured: ${this.bucketName}`);
        
        if (!this.bucketName) {
          throw new Error('GCP_STORAGE_BUCKET environment variable is required for production');
        }
      } catch (error) {
        this.logger.error('Failed to initialize GCS Storage:', error);
        throw error;
      }
    }
  }

  async saveTokens(tokenSet: any): Promise<void> {
    try {
      const tokenData = JSON.stringify(tokenSet, null, 2);
      
      if (this.configService.get('NODE_ENV') === 'development') {
        // Development: save to local file
        fs.writeFileSync(this.localTokenPath, tokenData);
        this.logger.log('Tokens saved to local file');
      } else {
        // Production: save to Google Cloud Storage
        const file = this.storage.bucket(this.bucketName).file(this.fileName);
        await file.save(tokenData, {
          metadata: {
            contentType: 'application/json',
          },
        });
        this.logger.log('Tokens saved to Cloud Storage');
      }
    } catch (error) {
      this.logger.error('Failed to save tokens', error);
      throw error;
    }
  }

  async loadTokens(): Promise<any | null> {
    try {
      const isDevelopment = this.configService.get('NODE_ENV') === 'development';
      this.logger.log(`🔍 Loading tokens - Environment: ${this.configService.get('NODE_ENV')}`);
      
      if (isDevelopment) {
        // Development: load from local file
        if (fs.existsSync(this.localTokenPath)) {
          const tokenData = fs.readFileSync(this.localTokenPath, 'utf8');
          this.logger.log('✅ Tokens loaded from local file');
          return JSON.parse(tokenData);
        }
        this.logger.log('❌ No local token file found');
        return null;
      } else {
        // Production: load from Google Cloud Storage
        this.logger.log(`🔄 Checking GCS bucket: ${this.bucketName}/${this.fileName}`);
        const file = this.storage.bucket(this.bucketName).file(this.fileName);
        const [exists] = await file.exists();
        
        if (!exists) {
          this.logger.log('❌ No tokens found in Cloud Storage');
          return null;
        }
        
        const [contents] = await file.download();
        const tokenData = contents.toString();
        this.logger.log('✅ Tokens loaded from Cloud Storage');
        return JSON.parse(tokenData);
      }
    } catch (error) {
      this.logger.error('❌ Failed to load tokens:', error);
      return null;
    }
  }
}