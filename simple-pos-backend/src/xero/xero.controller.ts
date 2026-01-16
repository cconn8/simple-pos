import { Controller, Get, Query, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { XeroService } from './xero.service';

@Controller('auth/xero')
export class XeroController {
  private readonly logger = new Logger(XeroController.name);

  constructor(private readonly xeroService: XeroService) {}

  /**
   * Start XERO OAuth flow
   * GET /auth/xero/connect
   */
  @Get('connect')
  async connect(@Res() res: Response) {
    try {
      const authUrl = await this.xeroService.getAuthorizationUrl();
      this.logger.log('🚀 Starting Xero OAuth flow - redirecting to authorization URL');
      return res.redirect(authUrl);
    } catch (error) {
      this.logger.error('Failed to start XERO OAuth flow', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to start XERO authentication' 
      });
    }
  }

  /**
   * Handle XERO OAuth callback
   * GET /auth/xero/callback
   */
  @Get('callback')
  async callback(@Query() query: any, @Res() res: Response) {
    try {
      const fullUrl = `${process.env.XERO_REDIRECT_URI}?${new URLSearchParams(query).toString()}`;
      
      const success = await this.xeroService.handleOAuthCallback(fullUrl);
      
      if (success) {
        this.logger.log('✅ Xero OAuth authentication successful - redirecting to frontend');
        // Redirect to frontend with success message
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?xero_auth=success`);
      } else {
        this.logger.error('❌ Xero OAuth authentication failed - redirecting to frontend');
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?xero_auth=error`);
      }
    } catch (error) {
      this.logger.error('XERO OAuth callback error', error);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?xero_auth=error`);
    }
  }

  /**
   * Check XERO authentication status
   * GET /auth/xero/status
   */
  @Get('status')
  async status() {
    try {
      const isAuthenticated = await this.xeroService.isAuthenticated();
      this.logger.log(`🔍 Xero status check: ${isAuthenticated ? 'Connected' : 'Not connected'}`);
      return {
        success: true,
        authenticated: isAuthenticated,
        message: isAuthenticated ? 'XERO is connected' : 'XERO authentication required'
      };
    } catch (error) {
      this.logger.error('Failed to check XERO status', error);
      return {
        success: false,
        authenticated: false,
        error: 'Failed to check XERO authentication status'
      };
    }
  }
}