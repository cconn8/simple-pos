"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { FuneralData, FuneralFormData, LoadingState } from '../types';
import { useFuneralsContext } from '@/contexts/FuneralsContext';
import { useAuthContext } from '@/contexts/AuthContext';

export const useApi = <T>() => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { getValidToken } = useAuthContext();
  const [state, setState] = useState<LoadingState & { data: T | null }> ({
    isLoading: false,
    error: null,
    data: null,
  });

  const apiCall = useCallback( async (url: string, options?: RequestInit): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const token = getValidToken();
      if (!token) {
        // Token invalid or expired - user will be automatically logged out
        throw new Error('Authentication required');
      }

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options?.headers,
        },
        ...options,
      });

      if (response.status === 401) {
        // Token expired or invalid - the auth system will handle logout
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState({ isLoading: false, error: null, data });
      // API call successful
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return null;
    }
  }, [getValidToken]);

  return { ...state, apiCall };
};

export const useInvoices = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { getValidToken } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInvoice = useCallback(async (funeralId: string, data?: any): Promise<any> => {
    // Generate invoice for funeral
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getValidToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Assuming the correct endpoint for invoice generation
      const response = await fetch(`${API_URL}/invoice/${funeralId}`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data || {})
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate invoice for funeral: ${funeralId}`);
      }
      
      const result = await response.json();
      // Invoice generated successfully
      return result;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error generating invoice:', err);
      setError(errorMessage);
      throw err; // Re-throw so caller can handle it
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, getValidToken]);

  return {
    generateInvoice,
    isLoading,
    error
  };
};

export const useFunerals = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { token } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {search, funerals, setFunerals, refreshTrigger} = useFuneralsContext();

  // Fetch funerals from API
  const fetchFunerals = useCallback(async () => {
    // Fetch funerals from API
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/funerals`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      if (!response.ok) { throw new Error(`HTTP ${response.status}`)};
      const data: any[] = await response.json(); // Allow mixed legacy and V2 formats
      setFunerals(data || []); // ensure always an array

    } catch (err) {
      console.error("Error fetching funerals:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setFunerals([]); // fallback to empty array

    } finally {
      setIsLoading(false);
    }
  }, [API_URL, setFunerals, token]);

  const createFuneral = useCallback( async(submissionData : FuneralFormData) => {
    // Create new funeral
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/funerals`, {
        method: "POST",
        headers: {
          "content-type" : "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(submissionData),
      });
      if(!response.ok) {throw new Error(`HTTP error! status : ${response.status}`)}
      const newFuneral : FuneralData = await response.json();
      // Funeral created successfully
      await fetchFunerals();
      return newFuneral;

    } catch (err) {
        console.error("Error creating funeral:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }

  }, [API_URL, fetchFunerals, token]);

  const updateFuneral = useCallback(async (id: string, submissionData: FuneralFormData) => {
    // Update funeral
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/funerals/${id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(submissionData),
      });
      if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`) }
      const updatedFuneral: FuneralData = await response.json();
      // Funeral updated successfully
      await fetchFunerals();
      return updatedFuneral;

    } catch (err) {
      console.error("Error updating funeral:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }

  }, [API_URL, fetchFunerals, token]);

  // Delete a funeral by ID and refresh the list
  const deleteFuneral = useCallback( async (id: string) => {
      // Delete funeral
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/funerals/${id}`, { 
          method: "DELETE",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        // After successful delete, refetch updated list
        await fetchFunerals();
      } catch (err) {
        console.error("Error deleting funeral:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    [API_URL, fetchFunerals, token]
  );

  // Fetch funerals on mount and when refresh is triggered
  useEffect(() => {
    fetchFunerals();
  }, [fetchFunerals, refreshTrigger]);

  // Filtered funerals by search term
  const filteredFunerals = useMemo(() => {
    if (!funerals || funerals.length === 0) return [];

    const normalizedSearch = search.toLowerCase();

    return funerals.filter((funeral) => {
      // Handle both legacy (formData) and V2 (funeralData) formats
      const fields = funeral.formData 
        ? [
            funeral.formData?.deceasedName,
            funeral.formData?.clientName, 
            funeral.formData?.notes,
          ]
        : [
            funeral.funeralData?.deceasedName,
            funeral.funeralData?.client?.name,
            funeral.funeralData?.notes,
          ];
      
      return fields.some((field) => field?.toLowerCase().includes(normalizedSearch));
    });
  }, [funerals, search]);

  return {
    funerals, // filtered and ready for display
    filteredFunerals,
    isLoading,
    error,
    fetchFunerals, // expose in case you want manual refresh
    createFuneral,
    updateFuneral,
    deleteFuneral, // delete handler
  };
};

export const useInventory = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { getValidToken } = useAuthContext();
  const { data : inventory, isLoading, error, apiCall } = useApi<any[]>();

  // Initialize inventory hook

  const fetchInventory = useCallback(async () => {
    return await apiCall(`${API_URL}/inventory`);
  }, [apiCall, API_URL]);

  const createInventoryItem = useCallback(async (itemData: any) => {
    return await apiCall(`${API_URL}/inventory`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }, [apiCall, API_URL]);

  const deleteInventoryItem = useCallback(async (id: string) => {
    return await apiCall(`${API_URL}/inventory/${id}`, {
      method: 'DELETE',
    });
  }, [apiCall, API_URL]);

  const updateInventoryItem = useCallback(async(id: string, itemData: any) => {
    // Send update request to server
    try {
      const token = getValidToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/inventory/${id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type" : "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });
      if(!response.ok) throw new Error('Error updating inventory item')
      // Inventory update successful
    } catch (err) {
        console.error("Error updating inventory item:", err);
        throw err;
    }
  }, [API_URL, getValidToken])

  return {
    inventory: inventory || [],
    isLoading,
    error,
    fetchInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  };
};
