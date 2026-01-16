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
var XeroService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XeroService = void 0;
const common_1 = require("@nestjs/common");
const xero_node_1 = require("xero-node");
const config_1 = require("@nestjs/config");
const token_storage_service_1 = require("../storage/token-storage.service");
let XeroService = XeroService_1 = class XeroService {
    constructor(configService, tokenStorage) {
        this.configService = configService;
        this.tokenStorage = tokenStorage;
        this.logger = new common_1.Logger(XeroService_1.name);
        this.tokenSet = null;
        this.xeroClient = new xero_node_1.XeroClient({
            clientId: this.configService.get('XERO_CLIENT_ID'),
            clientSecret: this.configService.get('XERO_CLIENT_SECRET'),
            redirectUris: [this.configService.get('XERO_REDIRECT_URI')],
            scopes: 'accounting.transactions accounting.contacts accounting.settings offline_access'.split(' '),
            state: 'returnPage=funeral-management',
            httpTimeout: 3000
        });
        this.loadTokens().catch(error => {
            this.logger.error('Failed to load tokens during initialization', error);
        });
    }
    async loadTokens() {
        try {
            this.tokenSet = await this.tokenStorage.loadTokens();
            if (this.tokenSet) {
                this.logger.log('XERO tokens loaded from storage');
            }
        }
        catch (error) {
            this.logger.error('Failed to load XERO tokens from storage', error);
        }
    }
    async saveTokens() {
        try {
            if (this.tokenSet) {
                await this.tokenStorage.saveTokens(this.tokenSet);
                this.logger.log('XERO tokens saved to storage');
            }
        }
        catch (error) {
            this.logger.error('Failed to save XERO tokens to storage', error);
        }
    }
    async initializeConnection() {
        try {
            if (!this.tokenSet) {
                await this.loadTokens();
            }
            if (!this.tokenSet) {
                this.logger.warn('No XERO token available. OAuth authentication required.');
                return false;
            }
            await this.xeroClient.setTokenSet(this.tokenSet);
            try {
                const tenants = await this.xeroClient.updateTenants();
                if (tenants && tenants.length > 0) {
                    this.logger.log('XERO connection established successfully');
                    return true;
                }
            }
            catch (tokenError) {
                this.logger.warn('XERO token might be expired, attempting refresh...');
                if (this.tokenSet.refresh_token) {
                    try {
                        const newTokenSet = await this.xeroClient.refreshToken();
                        this.tokenSet = newTokenSet;
                        await this.saveTokens();
                        const tenants = await this.xeroClient.updateTenants();
                        if (tenants && tenants.length > 0) {
                            this.logger.log('XERO connection refreshed successfully');
                            return true;
                        }
                    }
                    catch (refreshError) {
                        this.logger.error('Failed to refresh XERO token', refreshError);
                        return false;
                    }
                }
            }
            return false;
        }
        catch (error) {
            this.logger.error('Failed to initialize XERO connection', error);
            return false;
        }
    }
    async getAuthorizationUrl() {
        return await this.xeroClient.buildConsentUrl();
    }
    async handleOAuthCallback(url) {
        try {
            const tokenSet = await this.xeroClient.apiCallback(url);
            this.tokenSet = tokenSet;
            await this.saveTokens();
            await this.xeroClient.updateTenants();
            this.logger.log('XERO OAuth authentication successful');
            return true;
        }
        catch (error) {
            this.logger.error('XERO OAuth callback failed', error);
            return false;
        }
    }
    async createOrFindContact(contactData) {
        try {
            if (!this.tokenSet) {
                throw new common_1.HttpException('XERO not authenticated', common_1.HttpStatus.UNAUTHORIZED);
            }
            const tenants = await this.xeroClient.updateTenants();
            if (!tenants || tenants.length === 0) {
                throw new common_1.HttpException('No XERO organizations found', common_1.HttpStatus.BAD_REQUEST);
            }
            const tenantId = tenants[0].tenantId;
            const existingContacts = await this.xeroClient.accountingApi.getContacts(tenantId, undefined, `Name.Contains("${contactData.name}")`);
            if (existingContacts.body.contacts && existingContacts.body.contacts.length > 0) {
                const existingContact = existingContacts.body.contacts[0];
                this.logger.log(`Found existing XERO contact: ${existingContact.name} (ID: ${existingContact.contactID})`);
                return {
                    contactId: existingContact.contactID,
                    isExisting: true,
                    contactName: existingContact.name
                };
            }
            const newContact = {
                name: contactData.name,
                emailAddress: contactData.emailAddress,
                phones: contactData.phones || [],
                addresses: contactData.addresses || []
            };
            const createdContact = await this.xeroClient.accountingApi.createContacts(tenantId, { contacts: [newContact] });
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
        }
        catch (error) {
            this.logger.error('Failed to create/find XERO contact', error);
            throw new common_1.HttpException('Failed to create XERO contact', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createInvoice(invoiceData) {
        try {
            if (!this.tokenSet) {
                throw new common_1.HttpException('XERO not authenticated', common_1.HttpStatus.UNAUTHORIZED);
            }
            const tenants = await this.xeroClient.updateTenants();
            const tenantId = tenants[0].tenantId;
            const invoice = {
                type: invoiceData.type,
                contact: invoiceData.contact,
                invoiceNumber: invoiceData.invoiceNumber,
                reference: invoiceData.reference,
                date: invoiceData.date || new Date().toISOString().split('T')[0],
                dueDate: invoiceData.dueDate,
                status: invoiceData.status || 'AUTHORISED',
                lineItems: invoiceData.lineItems.map(item => ({
                    description: item.description,
                    quantity: item.quantity,
                    unitAmount: item.unitAmount,
                    accountCode: item.accountCode || '200'
                }))
            };
            const createdInvoice = await this.xeroClient.accountingApi.createInvoices(tenantId, { invoices: [invoice] });
            if (createdInvoice.body.invoices && createdInvoice.body.invoices.length > 0) {
                const invoice = createdInvoice.body.invoices[0];
                const invoiceUrl = `https://go.xero.com/Dashboard`;
                const invoiceNumber = invoice.invoiceNumber;
                this.logger.log(`Created XERO invoice: ${invoice.invoiceNumber} (ID: ${invoice.invoiceID})`);
                this.logger.log(`Invoice URL: ${invoiceUrl}`);
                return {
                    invoiceId: invoice.invoiceID,
                    invoiceUrl: invoiceUrl
                };
            }
            return null;
        }
        catch (error) {
            this.logger.error('Failed to create XERO invoice', error);
            const errorString = JSON.stringify(error);
            const duplicateInvoicePattern = /Invoice # must be unique/i;
            this.logger.debug('XERO Error Analysis:', {
                errorType: typeof error,
                errorConstructor: error?.constructor?.name,
                errorMessage: error?.message,
                containsDuplicateMessage: duplicateInvoicePattern.test(errorString)
            });
            if (duplicateInvoicePattern.test(errorString)) {
                this.logger.log(`Detected duplicate invoice: ${invoiceData.invoiceNumber}`);
                return {
                    invoiceId: '',
                    invoiceUrl: '',
                    success: false,
                    isDuplicateInvoice: true,
                    duplicateInvoiceNumber: invoiceData.invoiceNumber,
                    error: `Invoice number "${invoiceData.invoiceNumber}" already exists in XERO.`
                };
            }
            if (errorString.includes('Invoice not of valid status for creation')) {
                throw new common_1.HttpException('Invalid invoice status for creation. XERO only allows DRAFT, SUBMITTED, or AUTHORISED status when creating invoices. Invoices cannot be created directly as PAID.', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Failed to create XERO invoice', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async postFuneralToXero(postingData) {
        try {
            this.logger.log('Starting XERO posting process...');
            const connectionOk = await this.initializeConnection();
            if (!connectionOk) {
                return { success: false, error: 'XERO authentication failed or expired. Please re-authenticate.' };
            }
            const contactData = {
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
            if (contactResult.isExisting) {
                this.logger.log(`Using existing XERO contact: ${contactResult.contactName}`);
            }
            else {
                this.logger.log(`Created new XERO contact: ${contactResult.contactName}`);
            }
            const invoiceData = {
                type: postingData.invoiceType,
                contact: { contactID: contactResult.contactId },
                invoiceNumber: postingData.invoiceNumber,
                reference: postingData.reference,
                date: postingData.invoiceDate,
                dueDate: postingData.dueDate,
                status: postingData.invoiceStatus || 'AUTHORISED',
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
        }
        catch (error) {
            this.logger.error('XERO posting failed', error);
            return {
                success: false,
                error: error.message || 'Unknown error occurred during XERO posting'
            };
        }
    }
    generateUniqueInvoiceNumber(originalNumber) {
        const timestamp = Date.now().toString().slice(-6);
        return `${originalNumber}-${timestamp}`;
    }
    async markAsPosted(contactData, invoiceNumber) {
        try {
            const connectionOk = await this.initializeConnection();
            if (!connectionOk) {
                return { success: false, error: 'XERO authentication failed or expired. Please re-authenticate.' };
            }
            const contactResult = await this.createOrFindContact(contactData);
            if (!contactResult) {
                return { success: false, error: 'Failed to create/find contact in XERO' };
            }
            return {
                success: true,
                contactId: contactResult.contactId,
                contactName: contactResult.contactName,
                contactStatus: contactResult.isExisting ? 'existing' : 'created',
                invoiceId: `existing-${invoiceNumber}`,
                invoiceUrl: 'https://go.xero.com/Dashboard'
            };
        }
        catch (error) {
            this.logger.error('Failed to mark as posted to XERO', error);
            return {
                success: false,
                error: error.message || 'Unknown error occurred while marking as posted to XERO'
            };
        }
    }
    async isAuthenticated() {
        return this.tokenSet !== null && await this.initializeConnection();
    }
};
exports.XeroService = XeroService;
exports.XeroService = XeroService = XeroService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        token_storage_service_1.TokenStorageService])
], XeroService);
//# sourceMappingURL=xero.service.js.map