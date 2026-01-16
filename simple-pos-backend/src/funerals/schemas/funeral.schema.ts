import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PaymentStatus {
  PAID = 'Paid',
  PARTIALLY_PAID = 'Partially Paid',
  UNPAID = 'Unpaid',
}

@Schema({ timestamps: true })
export class Funeral extends Document {
  // Legacy format (keep for backward compatibility)
  @Prop({ type: Object, required: false })
  formData?: Record<string, any>;

  // NEW: V2 structured format for new funerals
  @Prop({ type: Object, required: false })
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

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.UNPAID, required: false})
  paymentStatus?: PaymentStatus; // Made optional for redesign

  @Prop({ type: Object, required: false })
  invoiceMetadata?: {
    invoiceNumber: string;
    generatedDate: Date;
    status: string;
    totalAmount: number;
    pdfUrl?: string;
    dueDate?: Date;
    notes?: string;
  };

  // XERO Integration Data
  @Prop({ type: Object, required: false })
  xeroData?: {
    contactId?: string;      // XERO contact ID after creation
    invoiceId?: string;      // XERO invoice ID after creation
    invoiceUrl?: string;     // Direct link to XERO invoice
    invoiceNumber?: string;  // XERO invoice number (may differ from our internal number)
    reference?: string;      // Reference used in XERO (defaults to deceased name)
    amountPosted?: number;   // Actual amount posted to XERO
    postedAt?: Date;         // When the invoice was posted to XERO
    status?: 'posting' | 'posted' | 'failed';  // Current XERO status
    errorMessage?: string;   // If posting failed, what went wrong
  };
}

export const FuneralSchema = SchemaFactory.createForClass(Funeral);
