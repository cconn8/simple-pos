import { useState, useCallback } from 'react';
import { LoadingState } from '../types';

export const useApi = <T>() => {
  const [state, setState] = useState<LoadingState & { data: T | null }>({
    isLoading: false,
    error: null,
    data: null,
  });

  const apiCall = useCallback(async (
    url: string,
    options?: RequestInit
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState({ isLoading: false, error: null, data });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return null;
    }
  }, []);

  return { ...state, apiCall };
};

export const useFunerals = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { data: funerals, isLoading, error, apiCall } = useApi<any[]>();

  const fetchFunerals = useCallback(async () => {
    return await apiCall(`${API_URL}/funerals`);
  }, [apiCall, API_URL]);

  const createFuneral = useCallback(async (funeralData: any) => {
    return await apiCall(`${API_URL}/funerals`, {
      method: 'POST',
      body: JSON.stringify(funeralData),
    });
  }, [apiCall, API_URL]);

  const deleteFuneral = useCallback(async (id: string) => {
    return await apiCall(`${API_URL}/funerals/${id}`, {
      method: 'DELETE',
    });
  }, [apiCall, API_URL]);

  return {
    funerals: funerals || [],
    isLoading,
    error,
    fetchFunerals,
    createFuneral,
    deleteFuneral,
  };
};

export const useInventory = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { data: inventory, isLoading, error, apiCall } = useApi<any[]>();

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

  return {
    inventory: inventory || [],
    isLoading,
    error,
    fetchInventory,
    createInventoryItem,
    deleteInventoryItem,
  };
};

export const useInvoices = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { data : invoices, isLoading, error, apiCall} = useApi<any[]>()
}