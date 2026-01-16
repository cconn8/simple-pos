import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { XeroClient, TokenSet } from 'xero-node';
import { ConfigService } from '@nestjs/config';
import { TokenStorageService } from '../storage/token-storage.service';

export interface XeroContact {
  contactId?: string;
  name: string;
  emailAddress?: string;
  phones?: Array<{
    phoneType: string;
    phoneNumber: string;
  }>;
  addresses?: Array<{
    addressType: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  }>;
}

export interface XeroInvoice {
  type: 'ACCREC' | 'ACCPAY';
  contact: { contactID: string };
  invoiceNumber?: string;
  reference?: string;
  date?: string;
  dueDate?: string;
  status?: 'DRAFT' | 'SUBMITTED' | 'AUTHORISED';
  lineItems: Array<{
    description: string;
    quantity: number;
    unitAmount: number;
    accountCode?: string;
  }>;
}

export interface XeroPostingData {
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  invoiceType: 'ACCREC' | 'ACCPAY';
  invoiceNumber?: string;
  reference?: string;
  invoiceDate?: string;
  dueDate?: string;
  invoiceStatus?: 'DRAFT' | 'SUBMITTED' | 'AUTHORISED';
  lineItemDescription: string;
  lineItemQuantity: number;
  lineItemUnitAmount: number;
  lineItemAccountCode?: string;
}

export interface XeroPostingResult {
  success: boolean;
  contactId?: string;
  contactName?: string;
  contactStatus?: 'existing' | 'created';
  invoiceId?: string;
  invoiceUrl?: string;
  error?: string;
  isDuplicateInvoice?: boolean;
  duplicateInvoiceNumber?: string;
}

@Injectable()
export class XeroService {
  private readonly logger = new Logger(XeroService.name);
  private xeroClient: XeroClient;
  private tokenSet: TokenSet | null = null;

  constructor(
    private configService: ConfigService,
    private tokenStorage: TokenStorageService
  ) {
    this.xeroClient = new XeroClient({
      clientId: this.configService.get('XERO_CLIENT_ID'),
      clientSecret: this.configService.get('XERO_CLIENT_SECRET'),
      redirectUris: [this.configService.get('XERO_REDIRECT_URI')],
      scopes: 'accounting.transactions accounting.contacts accounting.settings offline_access'.split(' '),
      state: 'returnPage=funeral-management',
      httpTimeout: 3000
    });

    // Load existing tokens on startup (async, so we don't await in constructor)
    this.loadTokens().catch(error => {
      this.logger.error('Failed to load tokens during initialization', error);
    });
  }

  /**
   * Load tokens from storage
   */
  private async loadTokens(): Promise<void> {
    try {
      this.tokenSet = await this.tokenStorage.loadTokens();
      if (this.tokenSet) {
        this.logger.log('XERO tokens loaded from storage');
      }
    } catch (error) {
      this.logger.error('Failed to load XERO tokens from storage', error);
    }
  }

  /**
   * Save tokens to storage
   */
  private async saveTokens(): Promise<void> {
    try {
      if (this.tokenSet) {
        await this.tokenStorage.saveTokens(this.tokenSet);
        this.logger.log('XERO tokens saved to storage');
      }
    } catch (error) {
      this.logger.error('Failed to save XERO tokens to storage', error);
    }
  }

  /**
   * Initialize XERO connection with stored or new token
   * For simplicity, we'll use a basic token storage approach
   */
  async initializeConnection(): Promise<boolean> {
    try {
      // Ensure tokens are loaded if not already
      if (!this.tokenSet) {
        await this.loadTokens();
      }
      
      // Check if we have tokens after loading
      if (!this.tokenSet) {
        this.logger.warn('No XERO token available. OAuth authentication required.');
        return false;
      }

      await this.xeroClient.setTokenSet(this.tokenSet);
      
      // Check if token is still valid and refresh if needed
      try {
        const tenants = await this.xeroClient.updateTenants();
        if (tenants && tenants.length > 0) {
          this.logger.log('XERO connection established successfully');
          return true;
        }
      } catch (tokenError) {
        // Token might be expired, try to refresh
        this.logger.warn('XERO token might be expired, attempting refresh...');
        
        if (this.tokenSet.refresh_token) {
          try {
            const newTokenSet = await this.xeroClient.refreshToken();
            this.tokenSet = newTokenSet;
            await this.saveTokens();
            
            // Try again with refreshed token
            const tenants = await this.xeroClient.updateTenants();
            if (tenants && tenants.length > 0) {
              this.logger.log('XERO connection refreshed successfully');
              return true;
            }
          } catch (refreshError) {
            this.logger.error('Failed to refresh XERO token', refreshError);
            return false;
          }
        }
      }
      
      return false;
    } catch (error) {
      this.logger.error('Failed to initialize XERO connection', error);
      return false;
    }
  }

  /**
   * Get XERO authorization URL for OAuth flow
   */
  async getAuthorizationUrl(): Promise<string> {
    return await this.xeroClient.buildConsentUrl();
  }

  /**
   * Handle OAuth callback and store tokens
   */
  async handleOAuthCallback(url: string): Promise<boolean> {
    try {
      const tokenSet = await this.xeroClient.apiCallback(url);
      this.tokenSet = tokenSet;
      
      // Save tokens for persistence
      await this.saveTokens();
      
      await this.xeroClient.updateTenants();
      
      this.logger.log('XERO OAuth authentication successful');
      return true;
    } catch (error) {
      this.logger.error('XERO OAuth callback failed', error);
      return false;
    }
  }

  /**
   * Create or find a contact in XERO
   */
  async createOrFindContact(contactData: XeroContact): Promise<{contactId: string; isExisting: boolean; contactName: string} | null> {
    try {
      if (!this.tokenSet) {
        throw new HttpException('XERO not authenticated', HttpStatus.UNAUTHORIZED);
      }

      const tenants = await this.xeroClient.updateTenants();
      if (!tenants || tenants.length === 0) {
        throw new HttpException('No XERO organizations found', HttpStatus.BAD_REQUEST);
      }

      const tenantId = tenants[0].tenantId;

      // First, try to find existing contact by name
      const existingContacts = await this.xeroClient.accountingApi.getContacts(
        tenantId, 
        undefined, // ifModifiedSince
        `Name.Contains("${contactData.name}")` // where clause
      );

      if (existingContacts.body.contacts && existingContacts.body.contacts.length > 0) {
        const existingContact = existingContacts.body.contacts[0];
        this.logger.log(`Found existing XERO contact: ${existingContact.name} (ID: ${existingContact.contactID})`);
        return {
          contactId: existingContact.contactID,
          isExisting: true,
          contactName: existingContact.name
        };
      }

      // Create new contact if not found
      const newContact: any = {
        name: contactData.name,
        emailAddress: contactData.emailAddress,
        phones: contactData.phones || [],
        addresses: contactData.addresses || []
      };

      const createdContact = await this.xeroClient.accountingApi.createContacts(
        tenantId,
        { contacts: [newContact] }
      );

      if (createdContact.body.contacts && createdContact.body.contacts.length > 0) {
        const contact = createdContact.body.contacts[0];
        this.logger.log(`Created new XERO contact: ${contact.name} (ID: ${contact.contactID})`);
        return {
          contactId: contact.contactID,
          isExisting: false,
          contactName: contact.name
        };
      }

      return null;
    } catch (error) {
      this.logger.error('Failed to create/find XERO contact', error);
      throw new HttpException('Failed to create XERO contact', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Create an invoice in XERO
   */
  async createInvoice(invoiceData: XeroInvoice): Promise<{ invoiceId: string; invoiceUrl: string; success?: boolean; isDuplicateInvoice?: boolean; duplicateInvoiceNumber?: string; error?: string } | null> {
    try {
      if (!this.tokenSet) {
        throw new HttpException('XERO not authenticated', HttpStatus.UNAUTHORIZED);
      }

      const tenants = await this.xeroClient.updateTenants();
      const tenantId = tenants[0].tenantId;

      const invoice: any = {
        type: invoiceData.type,
        contact: invoiceData.contact,
        invoiceNumber: invoiceData.invoiceNumber,
        reference: invoiceData.reference,
        date: invoiceData.date || new Date().toISOString().split('T')[0],
        dueDate: invoiceData.dueDate,
        status: invoiceData.status || 'AUTHORISED', // Set invoice status
        lineItems: invoiceData.lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitAmount: item.unitAmount,
          accountCode: item.accountCode || '200' // Default sales account
        }))
      };

      const createdInvoice = await this.xeroClient.accountingApi.createInvoices(
        tenantId,
        { invoices: [invoice] }
      );

      if (createdInvoice.body.invoices && createdInvoice.body.invoices.length > 0) {
        const invoice = createdInvoice.body.invoices[0];
        // Use the most basic XERO URL that always works
        const invoiceUrl = `https://go.xero.com/Dashboard`;
        
        // Store invoice number for user reference
        const invoiceNumber = invoice.invoiceNumber;
        
        this.logger.log(`Created XERO invoice: ${invoice.invoiceNumber} (ID: ${invoice.invoiceID})`);
        this.logger.log(`Invoice URL: ${invoiceUrl}`);
        return {
          invoiceId: invoice.invoiceID,
          invoiceUrl: invoiceUrl
        };
      }

      return null;
    } catch (error) {
      this.logger.error('Failed to create XERO invoice', error);
      
      // Check for specific XERO validation errors
      // First, try to parse the error message string to find validation errors
      const errorString = JSON.stringify(error);
      const duplicateInvoicePattern = /Invoice # must be unique/i;
      
      this.logger.debug('XERO Error Analysis:', {
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
        errorMessage: error?.message,
        containsDuplicateMessage: duplicateInvoicePattern.test(errorString)
      });
      
      // Check if error contains duplicate invoice message
      if (duplicateInvoicePattern.test(errorString)) {
        this.logger.log(`Detected duplicate invoice: ${invoiceData.invoiceNumber}`);
        // Return a special result for duplicate invoices instead of throwing error
        return {
          invoiceId: '',
          invoiceUrl: '',
          success: false,
          isDuplicateInvoice: true,
          duplicateInvoiceNumber: invoiceData.invoiceNumber,
          error: `Invoice number "${invoiceData.invoiceNumber}" already exists in XERO.`
        };
      }
      
      // Check for other validation errors by string matching
      if (errorString.includes('Invoice not of valid status for creation')) {
        throw new HttpException('Invalid invoice status for creation. XERO only allows DRAFT, SUBMITTED, or AUTHORISED status when creating invoices. Invoices cannot be created directly as PAID.', HttpStatus.BAD_REQUEST);
      }
      
      throw new HttpException('Failed to create XERO invoice', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Main method to post a funeral to XERO (creates contact + invoice)
   */
  async postFuneralToXero(postingData: XeroPostingData): Promise<XeroPostingResult> {
    try {
      this.logger.log('Starting XERO posting process...');

      // Ensure XERO connection is established and tokens are fresh
      const connectionOk = await this.initializeConnection();
      if (!connectionOk) {
        return { success: false, error: 'XERO authentication failed or expired. Please re-authenticate.' };
      }

      // Step 1: Create/find contact
      const contactData: XeroContact = {
        name: postingData.contactName,
        emailAddress: postingData.contactEmail,
        phones: postingData.contactPhone ? [{
          phoneType: 'DEFAULT',
          phoneNumber: postingData.contactPhone
        }] : [],
        addresses: postingData.addressLine1 ? [{
          addressType: 'POBOX',
          addressLine1: postingData.addressLine1,
          addressLine2: postingData.addressLine2,
          city: postingData.city,
          region: postingData.region,
          postalCode: postingData.postalCode,
          country: postingData.country || 'Ireland'
        }] : []
      };

      const contactResult = await this.createOrFindContact(contactData);
      if (!contactResult) {
        return { success: false, error: 'Failed to create/find contact in XERO' };
      }

      // Log contact status
      if (contactResult.isExisting) {
        this.logger.log(`Using existing XERO contact: ${contactResult.contactName}`);
      } else {
        this.logger.log(`Created new XERO contact: ${contactResult.contactName}`);
      }

      // Step 2: Create invoice
      const invoiceData: XeroInvoice = {
        type: postingData.invoiceType,
        contact: { contactID: contactResult.contactId },
        invoiceNumber: postingData.invoiceNumber,
        reference: postingData.reference,
        date: postingData.invoiceDate,
        dueDate: postingData.dueDate,
        status: postingData.invoiceStatus || 'AUTHORISED', // Default to awaiting payment
        lineItems: [{
          description: postingData.lineItemDescription,
          quantity: postingData.lineItemQuantity,
          unitAmount: postingData.lineItemUnitAmount,
          accountCode: postingData.lineItemAccountCode
        }]
      };

      const invoiceResult = await this.createInvoice(invoiceData);
      if (!invoiceResult) {
        return { success: false, error: 'Failed to create invoice in XERO' };
      }
      
      // Check if it's a duplicate invoice error
      if (invoiceResult.isDuplicateInvoice) {
        return {
          success: false,
          isDuplicateInvoice: true,
          duplicateInvoiceNumber: invoiceResult.duplicateInvoiceNumber,
          error: invoiceResult.error
        };
      }

      this.logger.log('XERO posting completed successfully');
      return {
        success: true,
        contactId: contactResult.contactId,
        contactName: contactResult.contactName,
        contactStatus: contactResult.isExisting ? 'existing' : 'created',
        invoiceId: invoiceResult.invoiceId,
        invoiceUrl: invoiceResult.invoiceUrl
      };

    } catch (error) {
      this.logger.error('XERO posting failed', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred during XERO posting'
      };
    }
  }

  /**
   * Generate a unique invoice number by appending timestamp
   */
  generateUniqueInvoiceNumber(originalNumber: string): string {
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    return `${originalNumber}-${timestamp}`;
  }

  /**
   * Mark a funeral as posted to XERO without creating new invoice (for existing invoices)
   */
  async markAsPosted(contactData: XeroContact, invoiceNumber: string): Promise<XeroPostingResult> {
    try {
      // Ensure XERO connection is established
      const connectionOk = await this.initializeConnection();
      if (!connectionOk) {
        return { success: false, error: 'XERO authentication failed or expired. Please re-authenticate.' };
      }

      // Create or find contact
      const contactResult = await this.createOrFindContact(contactData);
      if (!contactResult) {
        return { success: false, error: 'Failed to create/find contact in XERO' };
      }

      // Return success with contact info and basic invoice URL
      return {
        success: true,
        contactId: contactResult.contactId,
        contactName: contactResult.contactName,
        contactStatus: contactResult.isExisting ? 'existing' : 'created',
        invoiceId: `existing-${invoiceNumber}`, // Placeholder ID
        invoiceUrl: 'https://go.xero.com/Dashboard'
      };

    } catch (error) {
      this.logger.error('Failed to mark as posted to XERO', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred while marking as posted to XERO'
      };
    }
  }

  /**
   * Check if XERO is properly configured and authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    this.logger.log(`🔍 Checking authentication - tokenSet exists: ${this.tokenSet !== null}`);
    if (this.tokenSet === null) {
      // Try to load tokens if not already loaded
      await this.loadTokens();
      this.logger.log(`🔄 After loading - tokenSet exists: ${this.tokenSet !== null}`);
    }
    return this.tokenSet !== null && await this.initializeConnection();
  }
}