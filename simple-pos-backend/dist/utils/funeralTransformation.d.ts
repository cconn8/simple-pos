export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Unpaid';
export interface FuneralItem {
    _id: string;
    name: string;
    category: string;
    type: string;
    description: string;
    qty: number;
    isBillable: boolean | string;
    price: number;
}
export interface FuneralDataV2 {
    deceasedName: string;
    funeralType: string;
    dateOfDeath: string;
    lastAddress?: string;
    client: ClientDetails;
    billing: BillingDetails;
    contacts: ContactDetails;
    invoice: InvoiceDetails;
    fromDate?: string;
    toDate?: string;
    selectedItems: FuneralItem[];
    notes?: string;
    funeralNotes?: string;
}
export interface FuneralRecordV2 {
    _id: string;
    funeralData: FuneralDataV2;
    paymentStatus: PaymentStatus;
    createdAt?: string;
    updatedAt?: string;
}
export interface LegacyFuneralRecord {
    _id: string;
    formData: Record<string, any>;
    paymentStatus: PaymentStatus;
    invoice?: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface ClientDetails {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
}
export interface BillingDetails {
    careOf?: string;
    name?: string;
    address?: string;
    invoiceNumber?: string;
}
export interface ContactDetails {
    contactName1?: string;
    phone1?: string;
    contactName2?: string;
    phone2?: string;
}
export interface InvoiceDetails {
    invoiceNumber: string;
    generatedDate: string;
    dueDate?: string;
    status: string;
    totalAmount: number;
    discount?: number;
    pdfUrl?: string;
    notes?: string;
    lineItems?: FuneralItem[];
}
export declare function transformLegacyToV2(legacyRecord: any): FuneralRecordV2;
export declare function safeTransformToV2(unknownRecord: any): FuneralRecordV2 | null;
export declare function calcInvoiceTotalFromLegacyData(lineItems: FuneralItem[]): number;
