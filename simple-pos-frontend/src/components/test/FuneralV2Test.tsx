/**
 * TEST COMPONENT: FuneralV2 Type Safety Demo
 * 
 * LEARNING PURPOSE: This component demonstrates how our new types work
 * and shows the difference between old and new approaches.
 * 
 * You can temporarily add this to a page to see the types in action.
 * Delete this file once you're confident the types work correctly.
 */

import React from 'react';
import { FuneralDataV2, FuneralRecordV2 } from '../../types/funeralV2';
import { transformLegacyToV2 } from '../../utils/funeralTransformation';
import { createDefaultFuneralData } from '../../utils/funeralValidation';
import { formatDateDisplay } from '../../utils/dateUtils';

export function FuneralV2Test() {
  // Demo 1: Create new structured data (this is what we want!)
  const exampleV2Funeral: FuneralRecordV2 = {
    _id: 'test-123',
    funeralData: {
      deceasedName: 'John Doe',           // ✅ Required field
      funeralType: 'Funeral',             // ✅ Required field
      dateOfDeath: '2025-01-10',          // ✅ Required field
      lastAddress: '123 Main St',
      client: {                           // ✅ Organized in logical groups
        name: 'Jane Doe',
        address: '456 Oak Ave',
        phone: '555-0123',
        email: 'jane@example.com'
      },
      billing: {
        careOf: 'Mrs.',
        name: 'Jane Doe',
        address: '456 Oak Ave',
        invoiceNumber: 'INV-001'
      },
      contacts: {
        contactName1: 'Robert Doe',
        phone1: '555-0124',
        contactName2: 'Mary Smith',
        phone2: '555-0125'
      },
      invoice: {
        invoiceNumber: 'INV-001',
        generatedDate: '2025-01-10',
        status: 'Draft',
        totalAmount: 0
      },
      fromDate: '2025-01-08',             // Our "Commenced Work" date
      toDate: '2025-01-12',
      selectedItems: [],
      notes: 'Family requested simple service',
      funeralNotes: 'Cremation preferred'
    },
    paymentStatus: 'Unpaid'
  };

  // Demo 2: Simulate old data transformation
  const legacyData = {
    _id: 'legacy-456',
    formData: {
      deceasedName: 'Mary Johnson',
      dateOfDeath: '2025-01-05',
      clientName: 'Tom Johnson',
      clientPhone: '555-9999',
      fromDate: '2025-01-03',
      selectedItems: []
    },
    paymentStatus: 'Paid' as const
  };

  const transformedData = transformLegacyToV2(legacyData);

  return (
    <div className="p-6 bg-gray-50 rounded-lg m-4">
      <h2 className="text-2xl font-bold mb-4">🧪 FuneralV2 Type Safety Demo</h2>
      
      {/* Demo: Type-safe access to structured data */}
      <div className="bg-white p-4 rounded mb-4">
        <h3 className="text-lg font-semibold mb-2">✅ New Structured Data</h3>
        <div className="space-y-2">
          <p><strong>Deceased:</strong> {exampleV2Funeral.funeralData.deceasedName}</p>
          <p><strong>Date of Death:</strong> {formatDateDisplay(exampleV2Funeral.funeralData.dateOfDeath)}</p>
          <p><strong>Client:</strong> {exampleV2Funeral.funeralData.client.name}</p>
          <p><strong>Client Phone:</strong> {exampleV2Funeral.funeralData.client.phone}</p>
          <p><strong>Commenced Work:</strong> {formatDateDisplay(exampleV2Funeral.funeralData.fromDate)}</p>
          <p><strong>Payment Status:</strong> {exampleV2Funeral.paymentStatus}</p>
        </div>
      </div>

      {/* Demo: Transformation from legacy data */}
      <div className="bg-yellow-50 p-4 rounded mb-4">
        <h3 className="text-lg font-semibold mb-2">🔄 Transformed Legacy Data</h3>
        <div className="space-y-2">
          <p><strong>Deceased:</strong> {transformedData.funeralData.deceasedName}</p>
          <p><strong>Date of Death:</strong> {formatDateDisplay(transformedData.funeralData.dateOfDeath)}</p>
          <p><strong>Client:</strong> {transformedData.funeralData.client.name}</p>
          <p><strong>Client Phone:</strong> {transformedData.funeralData.client.phone}</p>
          <p><strong>Commenced Work:</strong> {formatDateDisplay(transformedData.funeralData.fromDate)}</p>
          <p><strong>Payment Status:</strong> {transformedData.paymentStatus}</p>
        </div>
      </div>

      {/* Demo: Default data creation */}
      <div className="bg-green-50 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">🆕 Default Empty Funeral</h3>
        <pre className="text-sm bg-white p-2 rounded overflow-auto">
          {JSON.stringify(createDefaultFuneralData(), null, 2)}
        </pre>
      </div>

      {/* Learning notes */}
      <div className="bg-blue-50 p-4 rounded mt-4">
        <h3 className="text-lg font-semibold mb-2">📚 What You&apos;re Seeing</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Autocompletion:</strong> Try typing &quot;exampleV2Funeral.funeralData.&quot; in VS Code</li>
          <li><strong>Type Safety:</strong> Try changing &quot;client.name&quot; to &quot;client.namee&quot; - you&apos;ll get an error!</li>
          <li><strong>Structured Data:</strong> Related fields are grouped logically</li>
          <li><strong>Backward Compatibility:</strong> Old data transforms cleanly to new structure</li>
          <li><strong>Null Safety:</strong> Missing fields become empty strings, not undefined</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * HOW TO TEST THIS:
 * 
 * 1. Import this component into any page temporarily:
 *    import { FuneralV2Test } from './path/to/FuneralV2Test';
 * 
 * 2. Add it to the JSX:
 *    <FuneralV2Test />
 * 
 * 3. Open the page in your browser to see the demo
 * 
 * 4. In VS Code, try modifying the code to see TypeScript errors:
 *    - Change "client.name" to "client.wrongField"
 *    - Try accessing non-existent properties
 *    - Notice how you get red squiggly lines immediately
 * 
 * 5. Once you're satisfied, remove the component from your page
 */

export default FuneralV2Test;