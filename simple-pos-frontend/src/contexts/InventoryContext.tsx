"use client";

import { useInventory } from "@/hooks/useApi";
import { useContext, useState, createContext, useEffect} from "react";
import { Inventory } from "@/types";


interface InventoryContextType {
    // state
    inventory : Inventory[];
    isLoading : boolean;
    error: any;
    isEditModalOpen: boolean;

    // setters    
    setIsEditModalOpen: (open: boolean) => void;

    // inventory management functions
    fetchInventory: () => Promise<any>;
    updateInventoryItem: (id: string, itemData: Partial<Inventory>) => Promise<void>;


}

export const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({children} : {children : React.ReactNode}) {
    const {inventory, isLoading, error, fetchInventory, updateInventoryItem} = useInventory();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    
    useEffect(() => { fetchInventory(); }, [fetchInventory]);


    return(
        <InventoryContext.Provider value={{
                inventory,
                isLoading,
                error,
                fetchInventory,
                updateInventoryItem,
                isEditModalOpen,
                setIsEditModalOpen,
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