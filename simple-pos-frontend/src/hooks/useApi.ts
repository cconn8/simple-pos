import { useState, useCallback, useMemo, useEffect } from 'react';
import { FuneralData, FuneralFormData, LoadingState } from '../types';
import { useFuneralsContext } from '@/contexts/FuneralsContext';

export const useApi = <T>() => {
  const [state, setState] = useState<LoadingState & { data: T | null }>
  ({
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
      console.log('api data is : ', data);
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
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {search, funerals, setFunerals, refreshTrigger} = useFuneralsContext();

  // Fetch funerals from API
  const fetchFunerals = useCallback(async () => {
    console.log('fetching funerals..');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/funerals`);
      if (!response.ok) { throw new Error(`HTTP ${response.status}`)};
      const data: FuneralData[] = await response.json();
      setFunerals(data || []); // ensure always an array

    } catch (err) {
      console.error("Error fetching funerals:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setFunerals([]); // fallback to empty array

    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  const createFuneral = useCallback( async(submissionData : FuneralFormData) => {
    console.log('creating funeral..');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/funerals`, {
        method: "POST",
        headers: {"content-type" : "application/json"},
        body: JSON.stringify(submissionData),
      });
      if(!response.ok) {throw new Error(`HTTP error! status : ${response.status}`)}
      const newFuneral : FuneralData = await response.json();
      console.log('funeral created successfully : ', newFuneral);
      await fetchFunerals();
      return newFuneral;

    } catch (err) {
        console.error("Error creating funeral:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }

  }, [API_URL, fetchFunerals]);

  // Delete a funeral by ID and refresh the list
  const deleteFuneral = useCallback( async (id: string) => {
      console.log('deleting funeral with id : ', id);
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/funerals/${id}`, { method: "DELETE" });
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
    [API_URL, fetchFunerals]
  );

  // Fetch funerals on mount and when refresh is triggered
  useEffect(() => {
    fetchFunerals();
  }, [fetchFunerals, refreshTrigger]);

  // Filtered funerals by search term
  const filteredFunerals = useMemo(() => {
    if (!funerals || funerals.length === 0) return [];

    const normalizedSearch = search.toLowerCase();

    return funerals.filter((funeral) =>
      [
        funeral.formData?.deceasedName,
        funeral.formData?.clientName,
        funeral.formData?.notes,
      ].some((field) => field?.toLowerCase().includes(normalizedSearch))
    );
  }, [funerals, search]);

  return {
    funerals, // filtered and ready for display
    filteredFunerals,
    isLoading,
    error,
    fetchFunerals, // expose in case you want manual refresh
    createFuneral,
    deleteFuneral, // delete handler
  };
};

export const useInventory = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { data : inventory, isLoading, error, apiCall } = useApi<any[]>();

  console.log('UseInventory hook called..')


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