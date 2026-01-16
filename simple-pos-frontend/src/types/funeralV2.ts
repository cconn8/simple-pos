/**
 * Phase 1: Type-Safe Funeral Data Models
 * 
 * This file replaces the flexible formData approach with strict typing.
 * 
 * KEY LEARNING: Instead of Record<string, any>, we define exactly what
 * our data should look like. This gives us:
 * - Autocompletion in your editor
 * - Compile-time error catching
 * - Clear documentation of data structure
 * - Confidence when refactoring
 */

import { FuneralItem, PaymentStatus } from './index';


// Supporting types for better organization
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


//TO BE LATER MIGRATED TO SEPERATE INVOICES RECORDS - FINE FOR NOW
export interface InvoiceDetails {
  invoiceNumber: string;          // Sequential: INV-001, INV-002, etc.
  generatedDate: string;          // When invoice was created
  dueDate?: string;               // Payment due date
  status: string;           
  totalAmount: number;            // Calculated from line items
  discount?: number;               // discount given
  pdfUrl?: string;                // Current PDF URL (keep existing)
  notes?: string;                 // Internal notes realting to the invoice only - ie. partially paid on 20 December
  lineItems? : FuneralItem[]       //migrate selected items to here
}

// PaymentStatus and FuneralItem imported from ./index to avoid duplication

// export type InvoiceStatus = 'Draft' | 'Generated' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

// Main funeral data interface - this replaces the formData Record<string, any>
export interface FuneralDataV2 {
  // Core deceased information
  deceasedName: string;           // Required: every funeral needs this
  dateOfDeath: string;            // Required: every funeral needs this
  lastAddress?: string;           // Optional: might not always have this
  
  // Client information (nested object for organization)
  client: ClientDetails;
  
  // Billing information  
  billing: BillingDetails;
  
  // Contact information
  contacts: ContactDetails;

  invoice : InvoiceDetails;
  
  // Date ranges
  fromDate?: string;              // This is our "Commenced Work" date
  toDate?: string;
  
  // Items and notes
  selectedItems: FuneralItem[];   // We'll use the existing FuneralItem type
  notes?: string;
  funeralNotes?: string;
}

// XERO Integration Data
export interface XeroData {
  contactId?: string;      // XERO contact ID after creation
  invoiceId?: string;      // XERO invoice ID after creation
  invoiceUrl?: string;     // Direct link to XERO invoice
  invoiceNumber?: string;  // XERO invoice number (may differ from our internal number)
  reference?: string;      // Reference used in XERO (defaults to deceased name)
  amountPosted?: number;   // Actual amount posted to XERO
  postedAt?: string;       // When the invoice was posted to XERO (ISO string)
  status?: 'posting' | 'posted' | 'failed';  // Current XERO status
  errorMessage?: string;   // If posting failed, what went wrong
}

// Complete funeral record with metadata
export interface FuneralRecordV2 {
  _id: string;                    // MongoDB ID
  funeralData: FuneralDataV2;     // Our new structured data
  paymentStatus: PaymentStatus;   // Existing payment status enum
  xeroData?: XeroData;            // XERO integration data
  // invoice?: string;               // Invoice URL
  createdAt?: string;
  updatedAt?: string;
}

// For backward compatibility during migration
export interface LegacyFuneralRecord {
  _id: string;
  formData: Record<string, any>;  // The old flexible structure
  paymentStatus: PaymentStatus;
  invoice?: string;
  xeroData?: XeroData;            // XERO integration data
  createdAt?: string;
  updatedAt?: string;
}

/**
 * TEACHING MOMENT:
 * 
 * Notice how we've gone from this:
 *   formData: Record<string, any>  ❌ TypeScript can't help you
 * 
 * To this:
 *   funeralData: FuneralDataV2     ✅ TypeScript knows exactly what's inside
 * 
 * This means:
 * 1. Your editor can autocomplete field names
 * 2. You'll get red squiggly lines if you mistype a field name
 * 3. You can't accidentally access fields that don't exist
 * 4. Refactoring becomes safe and automatic
 */