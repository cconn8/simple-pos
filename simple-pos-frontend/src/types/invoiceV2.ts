import { FuneralDataV2 } from "./funeralV2";

export interface InvoiceMetadata {
  id: string;
  funeralId: string;
  invoiceNumber: string;          // Sequential: INV-001, INV-002, etc.
  generatedDate: string;          // When invoice was created
  dueDate?: string;               // Payment due date
  status: InvoiceStatus;          // Draft, Sent, Paid, Overdue
  totalAmount: number;            // Calculated from line items
  pdfUrl?: string;                // Current PDF URL (keep existing)
  notes?: string;                 // Internal notes
}

export type InvoiceStatus = 'Draft' | 'Generated' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  funeralItemId: string;          // Reference to selected funeral item
  description: string;            // Item description
  quantity: number;               // How many
  unitPrice: number;              // Price per unit
  totalPrice: number;             // quantity * unitPrice
  category: string;               // Service, Product, Disbursement
}

export interface InvoiceRecord {
  metadata: InvoiceMetadata;
  lineItems: InvoiceLineItem[];
  funeralData: FuneralDataV2;     // Snapshot of funeral data at time of invoice
}