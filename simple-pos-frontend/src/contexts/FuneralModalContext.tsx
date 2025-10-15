"use client";

import React , {useContext, createContext, useState, ReactNode} from "react";
import { FuneralData } from "@/types";

//create the context (interface)
interface FuneralModalContextType {
    // Modal visibility states
    isCreateFuneralOpen: boolean;
    isUpdateFuneralOpen: boolean;
    isEditInvoiceOpen: boolean;
    isDeleteOpen: boolean;
    
    // Modal actions (functions)
    openCreateFuneral: () => void;
    closeCreateFuneral: () => void;
    openUpdateFuneral: (funeralData: FuneralData) => void;
    closeUpdateFuneral: () => void;
    openEditInvoice: (funeralId: string, deceasedName: string) => void;
    closeEditInvoice: () => void;
    openDelete: (funeralId: string, deceasedName: string, invoiceUrl?: string) => void;
    closeDelete: () => void;
    
    // Current editing data
    currentFuneral: FuneralData | null;
    currentFuneralId: string;
    currentDeceasedName: string;
    currentInvoiceUrl: string;
}

const FuneralModalContext = createContext<FuneralModalContextType | null>(null);


//create the provider component to wrap everything and give access to the context
export function FuneralModalProvider({children} : {children : React.ReactNode}) {
    // All the actual state lives here using useState hooks
    const [isCreateFuneralOpen, setIsCreateFuneralOpen] = useState(false);
    const [isUpdateFuneralOpen, setIsUpdateFuneralOpen] = useState(false);
    const [isEditInvoiceOpen, setIsEditInvoiceOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    
    const [currentFuneral, setCurrentFuneral] = useState<FuneralData | null>(null);
    const [currentFuneralId, setCurrentFuneralId] = useState('');
    const [currentDeceasedName, setCurrentDeceasedName] = useState('');
    const [currentInvoiceUrl, setCurrentInvoiceUrl] = useState('');

    // Define all the functions that components can call
  const openCreateFuneral = () => {
    console.log('Opening create funeral modal');
    setIsCreateFuneralOpen(true);
  };
  
  const closeCreateFuneral = () => {
    console.log('Closing create funeral modal');
    setIsCreateFuneralOpen(false);
  };
  
  const openUpdateFuneral = (funeralData: FuneralData) => {
    console.log('Opening update funeral modal for:', funeralData._id);
    setCurrentFuneral(funeralData);
    setCurrentFuneralId(funeralData._id);
    setIsUpdateFuneralOpen(true);
  };
  
  const closeUpdateFuneral = () => {
    console.log('Closing update funeral modal');
    setIsUpdateFuneralOpen(false);
    setCurrentFuneral(null);
  };
  
  const openEditInvoice = (funeralId: string, deceasedName: string) => {
    console.log('Opening edit invoice modal for:', funeralId);
    setCurrentFuneralId(funeralId);
    setCurrentDeceasedName(deceasedName);
    setIsEditInvoiceOpen(true);
  };
  
  const closeEditInvoice = () => {
    console.log('Closing edit invoice modal');
    setIsEditInvoiceOpen(false);
  };
  
  const openDelete = (funeralId: string, deceasedName: string, invoiceUrl = '') => {
    console.log('Opening delete modal for:', funeralId);
    setCurrentFuneralId(funeralId);
    setCurrentDeceasedName(deceasedName);
    setCurrentInvoiceUrl(invoiceUrl);
    setIsDeleteOpen(true);
  };
  
  const closeDelete = () => {
    console.log('Closing delete modal');
    setIsDeleteOpen(false);
  };

  // publish our state so other components can use it
  return (
    <FuneralModalContext.Provider value={{
        // State values
        isCreateFuneralOpen,
        isUpdateFuneralOpen,
        isEditInvoiceOpen,
        isDeleteOpen,
        // Functions
        openCreateFuneral,
        closeCreateFuneral,
        openUpdateFuneral,
        closeUpdateFuneral,
        openEditInvoice,
        closeEditInvoice,
        openDelete,
        closeDelete,
        // Current data
        currentFuneral,
        currentFuneralId,
        currentDeceasedName,
        currentInvoiceUrl,
        }}>
            {children}
    </FuneralModalContext.Provider>
  );
}

export function useFuneralModal(){

    const context = useContext(FuneralModalContext);

    if(!context) {
        throw new Error("useModal hook must be used within the Modal Provider")
    }

    return context;
}
