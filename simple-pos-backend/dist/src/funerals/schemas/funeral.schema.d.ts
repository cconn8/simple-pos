import { Document } from 'mongoose';
export declare enum PaymentStatus {
    PAID = "Paid",
    PARTIALLY_PAID = "Partially Paid",
    UNPAID = "Unpaid"
}
export declare class Funeral extends Document {
    formData?: Record<string, any>;
    funeralData?: {
        deceasedName: string;
        dateOfDeath: string;
        lastAddress?: string;
        client: {
            name?: string;
            address?: string;
            phone?: string;
            email?: string;
        };
        billing: {
            careOf?: string;
            name?: string;
            address?: string;
            invoiceNumber?: string;
        };
        contacts: {
            contactName1?: string;
            phone1?: string;
            contactName2?: string;
            phone2?: string;
        };
        invoice: {
            invoiceNumber: string;
            generatedDate: string;
            status: string;
            totalAmount: number;
            discount?: number;
            pdfUrl?: string;
            notes?: string;
            lineItems?: any[];
        };
        fromDate?: string;
        toDate?: string;
        selectedItems: any[];
        notes?: string;
        funeralNotes?: string;
    };
    paymentStatus?: PaymentStatus;
    invoiceMetadata?: {
        invoiceNumber: string;
        generatedDate: Date;
        status: string;
        totalAmount: number;
        pdfUrl?: string;
        dueDate?: Date;
        notes?: string;
    };
    xeroData?: {
        contactId?: string;
        invoiceId?: string;
        invoiceUrl?: string;
        invoiceNumber?: string;
        reference?: string;
        amountPosted?: number;
        postedAt?: Date;
        status?: 'posting' | 'posted' | 'failed';
        errorMessage?: string;
    };
}
export declare const FuneralSchema: import("mongoose").Schema<Funeral, import("mongoose").Model<Funeral, any, any, any, Document<unknown, any, Funeral, any> & Funeral & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Funeral, Document<unknown, {}, import("mongoose").FlatRecord<Funeral>, {}> & import("mongoose").FlatRecord<Funeral> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
