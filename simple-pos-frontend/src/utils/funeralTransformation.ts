/**
 * Data Transformation Layer
 * 
 * CRITICAL CONCEPT: This is your migration safety net!
 * 
 * This layer allows you to:
 * 1. Convert old flexible formData to new typed structure
 * 2. Convert new typed structure back to old format (for API compatibility)
 * 3. Migrate gradually without breaking existing functionality
 * 
 * Think of this as a translator between old and new data formats.
 */

import { FuneralItem } from '@/types';
import { 
  FuneralDataV2, 
  FuneralRecordV2, 
  LegacyFuneralRecord, 
  ClientDetails, 
  BillingDetails, 
  ContactDetails, 
  InvoiceDetails
} from '../types/funeralV2';
import { 
  safeString, 
  safeArray, 
  safeObject, 
  createDefaultFuneralData 
} from './funeralValidation';

/**
 * Transforms legacy formData structure to new typed structure
 * 
 * This is the key function that lets us safely read old data
 * with new code.
 */
export function transformLegacyToV2(legacyRecord: LegacyFuneralRecord): FuneralRecordV2 {
  const formData = legacyRecord.formData || {};

  // Extract client details safely
  const client: ClientDetails = {
    name: safeString(formData.clientName),
    address: safeString(formData.clientAddress),
    phone: safeString(formData.clientPhone),
    email: safeString(formData.clientEmail)
  };

  // Extract billing details safely
  const billing: BillingDetails = {
    careOf: safeString(formData.careOf),
    name: safeString(formData.billingName),
    address: safeString(formData.billingAddress),
    invoiceNumber: safeString(formData.invoiceNumber)
  };

  // Extract contact details safely
  const contacts: ContactDetails = {
    contactName1: safeString(formData.contactName1),
    phone1: safeString(formData.phone1),
    contactName2: safeString(formData.contactName2),
    phone2: safeString(formData.phone2)
  };

  //'invoice url field accessed at top level of legacy record (invoice)
  const invoice : InvoiceDetails = {
    invoiceNumber:          '', // Doesnt exist in legacy so return ''
    generatedDate:          '', // Doesnt exist in legacy so return ''
    dueDate:               '', // Doesnt exist in legacy so return ''
    status:                 '',         
    totalAmount:            calcInvoiceTotalFromLegacyData(formData.selectedItems),
    discount:               0,
    pdfUrl:                 safeString(formData.invoice),
    notes:                  '',
    lineItems :             safeArray(formData.selectedItems)
  }

  // Build the new structured data
  const funeralData: FuneralDataV2 = {
    deceasedName: safeString(formData.deceasedName),
    funeralType: safeString(formData.funeralType) || 'Funeral',
    dateOfDeath: safeString(formData.dateOfDeath),
    lastAddress: safeString(formData.lastAddress),
    client,
    billing,
    contacts,
    invoice,
    fromDate: safeString(formData.fromDate),
    toDate: safeString(formData.toDate),
    selectedItems: safeArray(formData.selectedItems),
    notes: safeString(formData.notes),
    funeralNotes: safeString(formData.funeralNotes)
  };

  return {
    _id: legacyRecord._id,
    funeralData,
    paymentStatus: legacyRecord.paymentStatus,
    // invoice: legacyRecord.invoice,
    xeroData: legacyRecord.xeroData, // Include XERO data
    createdAt: legacyRecord.createdAt,
    updatedAt: legacyRecord.updatedAt
  };
}

/**
 * Transforms new typed structure back to legacy formData structure
 * 
 * This is crucial for API compatibility - we can use new types internally
 * but still send data in the old format to the backend.
 */
export function transformV2ToLegacy(v2Record: FuneralRecordV2): LegacyFuneralRecord {
  const { funeralData } = v2Record;

  // Flatten the structured data back to formData object
  const formData: Record<string, any> = {
    // Core fields
    deceasedName: funeralData.deceasedName,
    dateOfDeath: funeralData.dateOfDeath,
    lastAddress: funeralData.lastAddress,
    
    // Client fields (flattened)
    clientName: funeralData.client.name,
    clientAddress: funeralData.client.address,
    clientPhone: funeralData.client.phone,
    clientEmail: funeralData.client.email,
    
    // Billing fields (flattened)
    careOf: funeralData.billing.careOf,
    billingName: funeralData.billing.name,
    billingAddress: funeralData.billing.address,
    invoiceNumber: funeralData.billing.invoiceNumber,
    
    // Contact fields (flattened)
    contactName1: funeralData.contacts.contactName1,
    phone1: funeralData.contacts.phone1,
    contactName2: funeralData.contacts.contactName2,
    phone2: funeralData.contacts.phone2,
    
    // Date and other fields
    fromDate: funeralData.fromDate,
    toDate: funeralData.toDate,
    selectedItems: funeralData.selectedItems,
    notes: funeralData.notes,
    funeralNotes: funeralData.funeralNotes
  };

  return {
    _id: v2Record._id,
    formData,
    paymentStatus: v2Record.paymentStatus,
    // invoice: v2Record.invoice,
    xeroData: v2Record.xeroData, // Include XERO data
    createdAt: v2Record.createdAt,
    updatedAt: v2Record.updatedAt
  };
}

/**
 * Transforms an array of legacy records to V2 format
 */
export function transformLegacyArrayToV2(legacyRecords: LegacyFuneralRecord[]): FuneralRecordV2[] {
  return legacyRecords.map(transformLegacyToV2);
}

/**
 * Transforms an array of V2 records to legacy format
 */
export function transformV2ArrayToLegacy(v2Records: FuneralRecordV2[]): LegacyFuneralRecord[] {
  return v2Records.map(transformV2ToLegacy);
}

/**
 * Safely creates a V2 funeral record from unknown data
 * 
 * This is useful when you're not sure if data is legacy or V2 format
 */
export function safeTransformToV2(unknownRecord: any): FuneralRecordV2 | null {
  try {
    // If it's already V2 format
    if (unknownRecord.funeralData && typeof unknownRecord.funeralData === 'object') {
      return unknownRecord as FuneralRecordV2;
    }

    // If it's legacy format
    if (unknownRecord.formData && typeof unknownRecord.formData === 'object') {
      return transformLegacyToV2(unknownRecord as LegacyFuneralRecord);
    }

    // Unknown format
    return null;
  } catch (error) {
    console.error('Error transforming funeral record:', error);
    return null;
  }
}

export function calcInvoiceTotalFromLegacyData(lineItems: FuneralItem[]) : number {

  let invoiceTotal = 0
  try {
    lineItems.map((item) => {
      invoiceTotal += item.qty * item.price
    })
    return invoiceTotal;
  }
  catch(error) {
    console.error('Error calculating invoice total from legacy data');
    return invoiceTotal;
  }
} 

/**
 * TEACHING MOMENT - Why This Approach Works:
 * 
 * 1. **Gradual Migration**: You can start using V2 types in new components
 *    while old components continue using legacy format
 * 
 * 2. **API Compatibility**: Backend doesn't need to change immediately
 *    You transform data at the boundary (before API calls)
 * 
 * 3. **Safety**: If transformation fails, you get null instead of crashes
 * 
 * 4. **Flexibility**: You can mix old and new code during migration
 * 
 * 5. **Rollback Ability**: If something goes wrong, you can easily revert
 *    by switching back to legacy functions
 * 
 * Example usage:
 * 
 * // In a component, use V2 types for type safety
 * const legacyFunerals = useFunerals(); // Returns legacy format
 * const v2Funerals = transformLegacyArrayToV2(legacyFunerals);
 * 
 * // Now you have full type safety!
 * v2Funerals.forEach(funeral => {
 *   console.log(funeral.funeralData.client.name); // ✅ Fully typed!
 * });
 */