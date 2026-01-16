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
    contact: {
        contactID: string;
    };
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
export declare class XeroService {
    private configService;
    private tokenStorage;
    private readonly logger;
    private xeroClient;
    private tokenSet;
    constructor(configService: ConfigService, tokenStorage: TokenStorageService);
    private loadTokens;
    private saveTokens;
    initializeConnection(): Promise<boolean>;
    getAuthorizationUrl(): Promise<string>;
    handleOAuthCallback(url: string): Promise<boolean>;
    createOrFindContact(contactData: XeroContact): Promise<{
        contactId: string;
        isExisting: boolean;
        contactName: string;
    } | null>;
    createInvoice(invoiceData: XeroInvoice): Promise<{
        invoiceId: string;
        invoiceUrl: string;
        success?: boolean;
        isDuplicateInvoice?: boolean;
        duplicateInvoiceNumber?: string;
        error?: string;
    } | null>;
    postFuneralToXero(postingData: XeroPostingData): Promise<XeroPostingResult>;
    generateUniqueInvoiceNumber(originalNumber: string): string;
    markAsPosted(contactData: XeroContact, invoiceNumber: string): Promise<XeroPostingResult>;
    isAuthenticated(): Promise<boolean>;
}
