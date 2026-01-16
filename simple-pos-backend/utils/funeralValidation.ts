/**
 * Validation Utilities for Funeral Data
 * 
 * TEACHING MOMENT: As a mid-level developer, you need to validate data
 * that comes from external sources (APIs, user input, etc.)
 * 
 * These functions help ensure data integrity and provide clear error messages.
 */

import { FuneralDataV2, ClientDetails, BillingDetails, ContactDetails } from './funeralTransformation';

/**
 * Checks if a funeral record has the minimum required data
 */
export function validateFuneralData(data: any): data is FuneralDataV2 {
  // Basic structure check
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Required fields check
  if (!data.deceasedName || typeof data.deceasedName !== 'string' || data.deceasedName.trim() === '') {
    return false;
  }

  if (!data.dateOfDeath || typeof data.dateOfDeath !== 'string') {
    return false;
  }

  // Ensure nested objects exist (even if empty)
  if (!data.client || typeof data.client !== 'object') {
    return false;
  }

  if (!data.billing || typeof data.billing !== 'object') {
    return false;
  }

  if (!data.contacts || typeof data.contacts !== 'object') {
    return false;
  }

  if (!Array.isArray(data.selectedItems)) {
    return false;
  }

  return true;
}

/**
 * Creates a default funeral data structure
 * This is useful when creating new funerals
 */
export function createDefaultFuneralData(): FuneralDataV2 {
  return {
    deceasedName: '',
    dateOfDeath: '',
    lastAddress: '',
    client: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    billing: {
      careOf: '',
      name: '',
      address: '',
      invoiceNumber: ''
    },
    contacts: {
      contactName1: '',
      phone1: '',
      contactName2: '',
      phone2: ''
    },
    invoice: {
      invoiceNumber: '',
      generatedDate: '',          // When invoice was created
      dueDate: '',              // Payment due date
      status:  '',         
      totalAmount: 0,           // Calculated from line items
      discount: 0,               // discount given
      pdfUrl: '',                // Current PDF URL (keep existing)
      notes: '',                 // Internal notes realting to the invoice only - ie. partially paid on 20 December
      lineItems : []       //migrate selected items to here
    },
    fromDate: '',
    toDate: '',
    selectedItems: [],
    notes: '',
    funeralNotes: ''
  };
}

/**
 * Safely extracts a string field from unknown data
 */
export function safeString(value: any, defaultValue: string = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return String(value);
}

/**
 * Safely extracts an array field from unknown data
 */
export function safeArray<T>(value: any, defaultValue: T[] = []): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return defaultValue;
}

/**
 * Safely extracts an object field from unknown data
 */
export function safeObject<T>(value: any, defaultValue: T): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return { ...defaultValue, ...value };
  }
  return defaultValue;
}

/**
 * TEACHING MOMENT:
 * 
 * These utilities demonstrate defensive programming:
 * 1. Never assume data is the shape you expect
 * 2. Always provide fallback values
 * 3. Use type guards (validateFuneralData) to ensure type safety
 * 4. Create factory functions (createDefaultFuneralData) for consistency
 * 
 * This approach prevents the "Cannot read property 'name' of undefined" errors
 * that plague many JavaScript applications.
 */