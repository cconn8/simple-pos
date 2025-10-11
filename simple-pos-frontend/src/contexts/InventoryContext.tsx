"use client";

import { useInventory } from "@/hooks/useApi";
import { useContext, createContext, useEffect} from "react";

export interface Inventory {
  _id: string;
  name: string;
  category: string;
  type: string;
  description?: string;
  qty: number;
  isBillable: string;
  price: number;
}

interface InventoryContextType {
    inventory : Inventory[];
    isLoading : boolean;
    error: any;
    fetchInventory: () => Promise<any>;
}

export const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({children} : {children : React.ReactNode}) {
    const {inventory, isLoading, error, fetchInventory} = useInventory();
    
    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('🚀 useEffect triggered on useInventory() hook - hook called on Inventory Provider Mount! Inventory : ', inventory);
        }
    }, [inventory]);
    
    return(
        <InventoryContext.Provider value={{
                inventory,
                isLoading,
                error,
                fetchInventory
            }}>
            {children}
        </InventoryContext.Provider>
    )
}

export function useInventoryContext() {
    const context = useContext(InventoryContext);
    if(!context) throw new Error("useInventoryContext must be used inside the inventory provider")
        return context;

}