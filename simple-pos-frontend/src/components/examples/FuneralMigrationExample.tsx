/**
 * PRACTICAL MIGRATION EXAMPLE
 * 
 * This component shows you EXACTLY how to migrate from useFunerals to useFuneralsV2
 * 
 * It demonstrates:
 * 1. Side-by-side comparison of old vs new code
 * 2. How the same data looks with type safety
 * 3. What errors you catch with TypeScript
 * 4. How easy the migration actually is
 */

import React, { useState } from 'react';
import { useFunerals } from '../../hooks/useApi';           // Old hook
import { useFuneralsV2 } from '../../hooks/useFuneralsV2';  // New hook
import { formatDateDisplay } from '../../utils/dateUtils';
import { createDefaultFuneralData } from '../../utils/funeralValidation';

export function FuneralMigrationExample() {
  const [showOldVersion, setShowOldVersion] = useState(false);

  return (
    <div className="p-6 bg-gray-50 rounded-lg m-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">🔄 Migration Example: useFunerals → useFuneralsV2</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowOldVersion(false)}
            className={`px-4 py-2 rounded ${!showOldVersion ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            ✅ New (Type-Safe)
          </button>
          <button 
            onClick={() => setShowOldVersion(true)}
            className={`px-4 py-2 rounded ${showOldVersion ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            ❌ Old (Unsafe)
          </button>
        </div>
      </div>

      {showOldVersion ? <OldUnsafeVersion /> : <NewTypeSafeVersion />}
    </div>
  );
}

/**
 * OLD VERSION: Using useFunerals (unsafe)
 * 
 * Problems you can see:
 * 1. No autocompletion for funeral.formData.???
 * 2. Constant null/undefined checks needed
 * 3. Easy to mistype field names
 * 4. No compile-time error checking
 */
function OldUnsafeVersion() {
  const { funerals, isLoading, error, createFuneral } = useFunerals();

  const handleCreateOldStyle = async () => {
    try {
      // OLD WAY: Passing formData directly (no structure, no safety)
      await createFuneral({
        deceasedName: 'John Doe',
        dateOfDeath: '2025-01-10',
        clientName: 'Jane Doe',         // Easy to mistype as clientNam
        clientPhone: '555-0123',
        fromDate: '2025-01-08'
        // Missing fields? Who knows! No warnings!
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) return <div>Loading funerals...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-red-50 p-4 rounded">
      <h3 className="text-lg font-semibold mb-4">❌ Old Unsafe Version</h3>
      
      {/* Display funerals - notice all the unsafe access */}
      <div className="space-y-4 mb-4">
        {funerals.slice(0, 3).map((funeral: any) => (
          <div key={funeral._id} className="bg-white p-3 rounded border">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {/* ❌ No type safety - these could be undefined */}
              <div><strong>Deceased:</strong> {funeral.formData?.deceasedName || 'Unknown'}</div>
              <div><strong>Date:</strong> {funeral.formData?.dateOfDeath || 'Unknown'}</div>
              <div><strong>Client:</strong> {funeral.formData?.clientName || 'Unknown'}</div>
              <div><strong>Started:</strong> {funeral.formData?.fromDate || 'Unknown'}</div>
              
              {/* ❌ Easy to make typos - no IntelliSense help */}
              <div><strong>Phone:</strong> {funeral.formData?.clientPhone || 'Unknown'}</div>
              {/* What if someone types clientPhon? No error until runtime! */}
              
              {/* ❌ Nested access is dangerous */}
              <div><strong>Payment:</strong> {funeral.paymentStatus || 'Unknown'}</div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleCreateOldStyle}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Create Funeral (Old Way)
      </button>

      <div className="mt-4 p-3 bg-yellow-100 rounded">
        <h4 className="font-semibold">Problems with this approach:</h4>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          <li>No autocompletion when typing <code>funeral.formData.</code></li>
          <li>Easy to mistype field names (clientNam instead of clientName)</li>
          <li>Constant null/undefined checking needed</li>
          <li>No compile-time error detection</li>
          <li>Hard to know what fields are available</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * NEW VERSION: Using useFuneralsV2 (type-safe)
 * 
 * Benefits you can see:
 * 1. Full autocompletion for funeral.funeralData.???
 * 2. Organized data structure
 * 3. Compile-time error checking
 * 4. Clear field organization
 */
function NewTypeSafeVersion() {
  const { funerals, isLoading, error, createFuneral } = useFuneralsV2();

  const handleCreateNewStyle = async () => {
    try {
      // NEW WAY: Structured, type-safe data
      const funeralData = createDefaultFuneralData();
      
      // ✅ Full type safety and autocompletion
      funeralData.deceasedName = 'John Doe';
      funeralData.dateOfDeath = '2025-01-10';
      funeralData.client.name = 'Jane Doe';        // ✅ Organized structure
      funeralData.client.phone = '555-0123';       // ✅ Logical grouping
      funeralData.fromDate = '2025-01-08';
      
      // Try typing funeralData.client. in VS Code - see the magic!
      
      await createFuneral(funeralData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) return <div>Loading funerals...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-green-50 p-4 rounded">
      <h3 className="text-lg font-semibold mb-4">✅ New Type-Safe Version</h3>
      
      {/* Display funerals - notice the clean, safe access */}
      <div className="space-y-4 mb-4">
        {funerals.slice(0, 3).map((funeral) => (
          <div key={funeral._id} className="bg-white p-3 rounded border">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {/* ✅ Type-safe access - no null checks needed */}
              <div><strong>Deceased:</strong> {funeral.funeralData.deceasedName}</div>
              <div><strong>Date:</strong> {formatDateDisplay(funeral.funeralData.dateOfDeath)}</div>
              
              {/* ✅ Organized structure - clear where data lives */}
              <div><strong>Client:</strong> {funeral.funeralData.client.name}</div>
              <div><strong>Phone:</strong> {funeral.funeralData.client.phone}</div>
              
              {/* ✅ Consistent date formatting */}
              <div><strong>Started:</strong> {formatDateDisplay(funeral.funeralData.fromDate)}</div>
              
              {/* ✅ Clean access to metadata */}
              <div><strong>Payment:</strong> {funeral.paymentStatus}</div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleCreateNewStyle}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Create Funeral (New Way)
      </button>

      <div className="mt-4 p-3 bg-blue-100 rounded">
        <h4 className="font-semibold">Benefits of this approach:</h4>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          <li>Full autocompletion: Type <code>funeral.funeralData.</code> and see all options</li>
          <li>Typo protection: <code>clientNam</code> gives immediate red underline</li>
          <li>No null checking: Fields are guaranteed to exist (empty string if not set)</li>
          <li>Logical organization: <code>client.name</code>, <code>billing.address</code>, etc.</li>
          <li>Refactoring safety: Rename fields and get automatic updates</li>
          <li>Documentation: Types serve as live documentation</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * MIGRATION INSTRUCTIONS:
 * 
 * To migrate ANY component from useFunerals to useFuneralsV2:
 * 
 * 1. Change the import:
 *    - OLD: import { useFunerals } from './hooks/useApi';
 *    - NEW: import { useFuneralsV2 } from './hooks/useFuneralsV2';
 * 
 * 2. Change the hook call:
 *    - OLD: const { funerals } = useFunerals();
 *    - NEW: const { funerals } = useFuneralsV2();
 * 
 * 3. Update data access:
 *    - OLD: funeral.formData?.deceasedName
 *    - NEW: funeral.funeralData.deceasedName
 * 
 * 4. Use structured data:
 *    - OLD: funeral.formData?.clientName
 *    - NEW: funeral.funeralData.client.name
 * 
 * That's it! Same functions, same behavior, just better types.
 */

export default FuneralMigrationExample;