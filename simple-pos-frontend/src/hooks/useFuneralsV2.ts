/**
 * useFuneralsV2 - Type-Safe Wrapper Hook
 * 
 * LEARNING OBJECTIVE: This demonstrates the "Wrapper Pattern"
 * 
 * Instead of rewriting everything, we WRAP the existing useFunerals hook
 * and transform the data to our new type-safe format.
 * 
 * Benefits:
 * 1. Zero risk - existing API calls still work exactly the same
 * 2. Type safety - we get full TypeScript benefits
 * 3. Gradual migration - can switch components one by one
 * 4. Easy rollback - just switch back to useFunerals if needed
 */

"use client";

import { useMemo, useCallback } from 'react';
import { useFunerals } from './useApi'; // Import existing hook
import { 
  FuneralRecordV2, 
  FuneralDataV2, 
  LegacyFuneralRecord 
} from '../types/funeralV2';
import { 
  transformLegacyToV2,
  safeTransformToV2
} from '../utils/funeralTransformation';

/**
 * Type-safe funeral management hook
 * 
 * This hook provides the EXACT same interface as useFunerals,
 * but with full type safety using our new V2 data structures.
 */
export function useFuneralsV2() {
  // Use the existing hook internally - NO changes to API calls!
  const legacyHook = useFunerals();

  /**
   * Transform funeral data from legacy format to V2 format
   * 
   * TEACHING MOMENT: useMemo prevents unnecessary transformations
   * Only re-runs when legacyHook.funerals actually changes
   */
  const funerals: FuneralRecordV2[] = useMemo(() => {
    if (!legacyHook.funerals || !Array.isArray(legacyHook.funerals)) {
      return [];
    }

    // Transform each legacy funeral to V2 format safely
    return legacyHook.funerals
      .map((funeral: any) => safeTransformToV2(funeral))
      .filter((funeral): funeral is FuneralRecordV2 => funeral !== null);
  }, [legacyHook.funerals]);

  /**
   * Transform filtered funerals to V2 format
   */
  const filteredFunerals: FuneralRecordV2[] = useMemo(() => {
    if (!legacyHook.filteredFunerals || !Array.isArray(legacyHook.filteredFunerals)) {
      return [];
    }

    const transformed = legacyHook.filteredFunerals
      .map((funeral: any) => {
        // Check if it's V2 format (has funeralData)
        if (funeral.funeralData && typeof funeral.funeralData === 'object') {
          return funeral as FuneralRecordV2; // Direct pass-through for V2 records
        }
        
        // Check if it's legacy format (has formData)
        if (funeral.formData && typeof funeral.formData === 'object') {
          return transformLegacyToV2(funeral);
        }
        
        // Unknown format - skip
        return null;
      })
      .filter((funeral): funeral is FuneralRecordV2 => funeral !== null);
    return transformed;
  }, [legacyHook.filteredFunerals]);

  /**
   * Type-safe create funeral function - SENDS V2 DATA DIRECTLY
   * 
   * New approach: sends V2 format data directly to backend,
   * no transformation needed!
   */
  const createFuneral = useCallback(async (funeralDataV2: FuneralDataV2): Promise<FuneralRecordV2 | null> => {
    try {
      // Prepare V2 data for direct API call
      const v2SubmissionData = {
        funeralData: funeralDataV2
        // paymentStatus removed for redesign
      };

      // Send V2 data directly to backend
      const result = await legacyHook.createFuneral(v2SubmissionData as any);
      
      if (result) {
        // Try to transform the result
        const transformedResult = safeTransformToV2(result);
        
        if (transformedResult) {
          return transformedResult;
        } else {
          // If transformation fails, trigger a data refresh to get the latest data
          await legacyHook.fetchFunerals();
          return null; // Let the UI update from the refreshed data
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error in createFuneral V2:', error);
      throw error; // Re-throw to maintain error handling behavior
    }
  }, []);

  /**
   * Type-safe update funeral function - MIGRATES TO V2 FORMAT
   * 
   * This function converts funeral records to clean V2 format,
   * removing any legacy formData in the process.
   */
  const updateFuneral = useCallback(async (id: string, funeralDataV2: FuneralDataV2): Promise<FuneralRecordV2 | null> => {
    try {
      // Prepare V2 data for direct API call
      const v2UpdateData = {
        funeralData: funeralDataV2
        // paymentStatus removed for redesign
      };

      // Send V2 data directly to backend (backend will remove legacy formData)
      const result = await legacyHook.updateFuneral(id, v2UpdateData as any);
      
      if (result) {
        // Try to transform the result
        const transformedResult = safeTransformToV2(result);
        
        if (transformedResult) {
          return transformedResult;
        } else {
          // If transformation fails, trigger a data refresh to get the clean V2 data
          await legacyHook.fetchFunerals();
          return null; // Let the UI update from the refreshed data
        }
      } else {
        // If no result returned, refresh data to get the updated record
        await legacyHook.fetchFunerals();
      }
      
      return null;
    } catch (error) {
      console.error('Error in updateFuneral V2:', error);
      throw error;
    }
  }, []);

  /**
   * Delete funeral - no transformation needed, just pass through
   */
  const deleteFuneral = useCallback(async (id: string): Promise<void> => {
    return legacyHook.deleteFuneral(id);
  }, []);

  /**
   * Fetch funerals - no transformation needed, just pass through
   * The transformation happens in the useMemo above
   */
  const fetchFunerals = useCallback(async (): Promise<void> => {
    return legacyHook.fetchFunerals();
  }, []);

  // Return the same interface as the original hook, but with type-safe data
  return {
    funerals,                    // ✅ Now FuneralRecordV2[]
    filteredFunerals,           // ✅ Now FuneralRecordV2[]
    isLoading: legacyHook.isLoading,
    error: legacyHook.error,
    fetchFunerals,              // ✅ Same function, works the same
    createFuneral,              // ✅ Now accepts FuneralDataV2
    updateFuneral,              // ✅ Now accepts FuneralDataV2
    deleteFuneral,              // ✅ Same function, works the same
  };
}

/**
 * TEACHING MOMENT - Why This Pattern Works:
 * 
 * 1. **Zero Breaking Changes**: The original useFunerals still works exactly the same
 * 2. **Same Interface**: useFuneralsV2 has identical functions, just better types
 * 3. **Internal Transformation**: Data conversion happens inside the hook, not in components
 * 4. **Gradual Adoption**: Components can switch to useFuneralsV2 one by one
 * 5. **Easy Rollback**: Just change import back to useFunerals if needed
 * 
 * Example migration:
 * 
 * // Before (in a component):
 * import { useFunerals } from './hooks/useApi';
 * const { funerals } = useFunerals(); // funerals is any[]
 * 
 * // After (just change the import):
 * import { useFuneralsV2 } from './hooks/useFuneralsV2';
 * const { funerals } = useFuneralsV2(); // funerals is FuneralRecordV2[]
 * 
 * That's it! Same function calls, same behavior, but now with full type safety.
 */