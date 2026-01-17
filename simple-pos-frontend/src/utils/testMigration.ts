/**
 * Migration Layer Test Utilities
 * 
 * TEACHING PURPOSE: Always test your architectural changes!
 * 
 * This file contains simple tests to verify our transformation layer works correctly.
 * Run these tests to ensure your migration is safe.
 */

import { 
  transformLegacyToV2, 
  transformV2ToLegacy,
  safeTransformToV2 
} from './funeralTransformation';
import { createDefaultFuneralData } from './funeralValidation';
import { FuneralRecordV2, LegacyFuneralRecord } from '../types/funeralV2';

/**
 * Test 1: Legacy to V2 transformation
 */
export function testLegacyToV2Transform(): boolean {
  console.log('🧪 Testing Legacy to V2 transformation...');

  // Simulate legacy data from your current API
  const legacyData: LegacyFuneralRecord = {
    _id: 'test-123',
    formData: {
      deceasedName: 'John Doe',
      dateOfDeath: '2025-01-10',
      clientName: 'Jane Doe',
      clientPhone: '555-0123',
      billingName: 'Jane Doe',
      billingAddress: '123 Main St',
      fromDate: '2025-01-08',
      selectedItems: []
    },
    paymentStatus: 'Unpaid'
  };

  try {
    const v2Data = transformLegacyToV2(legacyData);

    // Verify the transformation worked correctly
    console.log('✅ Legacy data:', legacyData.formData.clientName);
    console.log('✅ V2 data:', v2Data.funeralData.client.name);
    
    const success = 
      v2Data.funeralData.deceasedName === 'John Doe' &&
      v2Data.funeralData.client.name === 'Jane Doe' &&
      v2Data.funeralData.client.phone === '555-0123' &&
      v2Data.funeralData.fromDate === '2025-01-08';

    if (success) {
      console.log('✅ Legacy to V2 transformation: PASSED');
      return true;
    } else {
      console.error('❌ Legacy to V2 transformation: FAILED');
      return false;
    }
  } catch (error) {
    console.error('❌ Legacy to V2 transformation error:', error);
    return false;
  }
}

/**
 * Test 2: V2 to Legacy transformation (round-trip test)
 */
export function testV2ToLegacyTransform(): boolean {
  console.log('🧪 Testing V2 to Legacy transformation...');

  // Create V2 data
  const v2Data: FuneralRecordV2 = {
    _id: 'test-456',
    funeralData: {
      deceasedName: 'Mary Smith',
      funeralType: 'Funeral',
      dateOfDeath: '2025-01-15',
      lastAddress: '456 Oak Ave',
      client: {
        name: 'Tom Smith',
        phone: '555-9999',
        address: '789 Pine St',
        email: 'tom@example.com'
      },
      billing: {
        name: 'Tom Smith',
        address: '789 Pine St',
        careOf: 'Mr.',
        invoiceNumber: 'INV-001'
      },
      contacts: {
        contactName1: 'Bob Smith',
        phone1: '555-1111'
      },
      invoice: {
        invoiceNumber: 'INV-001',
        generatedDate: '2025-01-15',
        status: 'Generated',
        totalAmount: 0
      },
      fromDate: '2025-01-12',
      toDate: '2025-01-20',
      selectedItems: [],
      notes: 'Test notes'
    },
    paymentStatus: 'Paid'
  };

  try {
    const legacyData = transformV2ToLegacy(v2Data);

    // Verify the reverse transformation worked
    const success = 
      legacyData.formData.deceasedName === 'Mary Smith' &&
      legacyData.formData.clientName === 'Tom Smith' &&
      legacyData.formData.clientPhone === '555-9999' &&
      legacyData.formData.billingName === 'Tom Smith' &&
      legacyData.formData.fromDate === '2025-01-12' &&
      legacyData.paymentStatus === 'Paid';

    if (success) {
      console.log('✅ V2 to Legacy transformation: PASSED');
      return true;
    } else {
      console.error('❌ V2 to Legacy transformation: FAILED');
      console.log('Expected clientName: Tom Smith, Got:', legacyData.formData.clientName);
      return false;
    }
  } catch (error) {
    console.error('❌ V2 to Legacy transformation error:', error);
    return false;
  }
}

/**
 * Test 3: Round-trip transformation (most important test!)
 */
export function testRoundTripTransformation(): boolean {
  console.log('🧪 Testing round-trip transformation...');

  // Start with legacy data
  const originalLegacy: LegacyFuneralRecord = {
    _id: 'round-trip-test',
    formData: {
      deceasedName: 'Round Trip Test',
      dateOfDeath: '2025-01-01',
      clientName: 'Test Client',
      clientPhone: '555-TEST',
      fromDate: '2024-12-30'
    },
    paymentStatus: 'Partially Paid'
  };

  try {
    // Transform: Legacy → V2 → Legacy
    const v2Data = transformLegacyToV2(originalLegacy);
    const backToLegacy = transformV2ToLegacy(v2Data);

    // Verify we get back what we started with
    const success = 
      backToLegacy.formData.deceasedName === originalLegacy.formData.deceasedName &&
      backToLegacy.formData.clientName === originalLegacy.formData.clientName &&
      backToLegacy.formData.clientPhone === originalLegacy.formData.clientPhone &&
      backToLegacy.paymentStatus === originalLegacy.paymentStatus;

    if (success) {
      console.log('✅ Round-trip transformation: PASSED');
      return true;
    } else {
      console.error('❌ Round-trip transformation: FAILED');
      return false;
    }
  } catch (error) {
    console.error('❌ Round-trip transformation error:', error);
    return false;
  }
}

/**
 * Test 4: Safe transformation with invalid data
 */
export function testSafeTransformation(): boolean {
  console.log('🧪 Testing safe transformation with invalid data...');

  try {
    // Test with invalid/missing data
    const result1 = safeTransformToV2(null);
    const result2 = safeTransformToV2({});
    const result3 = safeTransformToV2({ randomField: 'random' });

    const success = result1 === null && result2 === null && result3 === null;

    if (success) {
      console.log('✅ Safe transformation: PASSED');
      return true;
    } else {
      console.error('❌ Safe transformation: FAILED');
      return false;
    }
  } catch (error) {
    console.error('❌ Safe transformation error:', error);
    return false;
  }
}

/**
 * Run all tests
 */
export function runAllMigrationTests(): boolean {
  console.log('🚀 Running all migration tests...\n');

  const results = [
    testLegacyToV2Transform(),
    testV2ToLegacyTransform(),
    testRoundTripTransformation(),
    testSafeTransformation()
  ];

  const allPassed = results.every(result => result === true);
  const passedCount = results.filter(result => result === true).length;

  console.log(`\n📊 Test Results: ${passedCount}/${results.length} tests passed`);

  if (allPassed) {
    console.log('🎉 All migration tests PASSED! Your migration layer is safe to use.');
  } else {
    console.error('💥 Some tests FAILED! Check the errors above before proceeding.');
  }

  return allPassed;
}

/**
 * HOW TO RUN THESE TESTS:
 * 
 * In a component or page, temporarily add:
 * 
 * import { runAllMigrationTests } from '../utils/testMigration';
 * 
 * useEffect(() => {
 *   runAllMigrationTests();
 * }, []);
 * 
 * Then check the browser console for test results.
 * Remove the test code once you're confident everything works.
 */