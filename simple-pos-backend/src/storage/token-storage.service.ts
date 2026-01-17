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
      this.logger.log('💾 Saving tokens...');
      this.logger.log(`🔍 Token details being saved: access_token exists: ${!!tokenSet.access_token}, refresh_token exists: ${!!tokenSet.refresh_token}`);
      
      const tokenData = JSON.stringify(tokenSet, null, 2);
      
      if (this.configService.get('NODE_ENV') === 'development') {
        // Development: save to local file
        fs.writeFileSync(this.localTokenPath, tokenData);
        this.logger.log('✅ Tokens saved to local file');
      } else {
        // Production: save to Google Cloud Storage
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
        
        // Verify the save by checking if file exists
        const [exists] = await file.exists();
        if (exists) {
          this.logger.log('✅ Token save verified - file exists in GCS');
        } else {
          this.logger.warn('⚠️ Token save verification failed - file not found in GCS');
        }
      }
    } catch (error) {
      this.logger.error('❌ Failed to save tokens:', error);
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
          const parsedTokens = JSON.parse(tokenData);
          this.logger.log('✅ Tokens loaded from local file');
          this.logger.log(`🔍 Token details: access_token exists: ${!!parsedTokens.access_token}, refresh_token exists: ${!!parsedTokens.refresh_token}`);
          return parsedTokens;
        }
        this.logger.log('❌ No local token file found');
        return null;
      } else {
        // Production: load from Google Cloud Storage
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
        
        // Check token expiry if available
        if (parsedTokens.expires_at) {
          const expiryDate = new Date(parsedTokens.expires_at * 1000); // Convert from unix timestamp
          const now = new Date();
          const isExpired = now > expiryDate;
          this.logger.log(`🕐 Token expiry: ${expiryDate.toISOString()}, Expired: ${isExpired}`);
        }
        
        return parsedTokens;
      }
    } catch (error) {
      this.logger.error('❌ Failed to load tokens:', error);
      if (error instanceof SyntaxError) {
        this.logger.error('❌ Token file appears to be corrupted (invalid JSON)');
      }
      return null;
    }
  }

  async deleteTokens(): Promise<void> {
    try {
      this.logger.log('🧹 Deleting stored tokens...');
      
      if (this.configService.get('NODE_ENV') === 'development') {
        // Development: delete local file
        if (fs.existsSync(this.localTokenPath)) {
          fs.unlinkSync(this.localTokenPath);
          this.logger.log('✅ Local token file deleted');
        } else {
          this.logger.log('ℹ️ No local token file to delete');
        }
      } else {
        // Production: delete from Google Cloud Storage
        if (!this.storage || !this.bucketName) {
          throw new Error('GCS Storage or bucket not properly configured');
        }
        
        const file = this.storage.bucket(this.bucketName).file(this.fileName);
        const [exists] = await file.exists();
        
        if (exists) {
          await file.delete();
          this.logger.log('✅ Token file deleted from Cloud Storage');
        } else {
          this.logger.log('ℹ️ No token file found in Cloud Storage to delete');
        }
      }
    } catch (error) {
      this.logger.error('❌ Failed to delete tokens:', error);
      throw error;
    }
  }
}