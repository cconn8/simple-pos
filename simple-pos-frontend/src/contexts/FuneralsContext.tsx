"use client";

import React, {useContext, createContext, useState} from "react";
import { FuneralData, SelectedFuneralItem } from "../types";

interface FuneralsContextType {
    //states
    search: string;
    showFuneralModal : boolean;
    funerals: FuneralData[];
    refreshTrigger: number;
    showDeleteModal: boolean;
    deleteTarget: { id: string; name: string } | null;
    selectedFuneralItems: SelectedFuneralItem[];
    editingItem: SelectedFuneralItem | null;
    isEditingFuneralItem: boolean;
    keepChanges : boolean;
    showFuneralDetail: boolean;
    viewingFuneral: FuneralData | null;
    isEditMode: boolean;


    //state setters
    setSearch : (arg: string) => void;
    setShowFuneralModal : (arg: boolean) => void;
    setFunerals: (funerals: FuneralData[]) => void;
    triggerRefresh: () => void;
    setShowDeleteModal: (show: boolean) => void;
    setDeleteTarget: (target: { id: string; name: string } | null) => void;
    setKeepChanges : (arg: boolean) => void;
    setShowFuneralDetail: (show: boolean) => void;
    setViewingFuneral: (funeral: FuneralData | null) => void;
    setIsEditMode: (isEdit: boolean) => void;
    
    // Funeral item management
    addFuneralItem: (item: SelectedFuneralItem) => void;
    removeFuneralItem: (itemId: string) => void;
    updateFuneralItem: (itemId: string, updates: Partial<SelectedFuneralItem>) => void;
    clearFuneralItems: () => void;
    setSelectedFuneralItems: (items: SelectedFuneralItem[]) => void;
    startEditingItem: (item: SelectedFuneralItem) => void;
    stopEditingItem: () => void;
}

const FuneralsContext = createContext<FuneralsContextType | null>(null)

export function FuneralsProvider({children} : {children: React.ReactNode}) {
    const [search, setSearch]                       = useState("");
    const [showFuneralModal, setShowFuneralModal]   = useState(false);
    const [funerals, setFunerals]                   = useState<FuneralData[]>([]);
    const [refreshTrigger, setRefreshTrigger]       = useState(0);
    const [showDeleteModal, setShowDeleteModal]     = useState(false);
    const [deleteTarget, setDeleteTarget]           = useState<{ id: string; name: string } | null>(null);
    const [selectedFuneralItems, setSelectedFuneralItems] = useState<SelectedFuneralItem[]>([]);
    const [editingItem, setEditingItem]             = useState<SelectedFuneralItem | null>(null);
    const [isEditingFuneralItem, setIsEditingFuneralItem] = useState(false);
    const [keepChanges, setKeepChanges] = useState(false);
    const [showFuneralDetail, setShowFuneralDetail] = useState(false);
    const [viewingFuneral, setViewingFuneral] = useState<FuneralData | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);


    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Funeral item management functions
    const addFuneralItem = (item: SelectedFuneralItem) => {
        const existingItem = selectedFuneralItems.find(existing => existing._id === item._id);
        if (existingItem) {
            // Increment quantity if item already exists
            updateFuneralItem(item._id, { 
                selectedQty: existingItem.selectedQty + 1,
                totalPrice: (existingItem.selectedQty + 1) * existingItem.price
            });
        } else {
            // Add new item
            setSelectedFuneralItems(prev => [...prev, item]);
        }
    };

    const removeFuneralItem = (itemId: string) => {
        setSelectedFuneralItems(prev => prev.filter(item => item._id !== itemId));
    };

    const updateFuneralItem = (itemId: string, updates: Partial<SelectedFuneralItem>) => {
        setSelectedFuneralItems(prev => prev.map(item => 
            item._id === itemId 
                ? { ...item, ...updates, totalPrice: (updates.selectedQty || item.selectedQty) * (updates.price || item.price) }
                : item
        ));
    };

    const clearFuneralItems = () => {
        setSelectedFuneralItems([]);
    };

    const startEditingItem = (item: SelectedFuneralItem) => {
        setEditingItem(item);
        setIsEditingFuneralItem(true);
    };

    const stopEditingItem = () => {
        setEditingItem(null);
        setIsEditingFuneralItem(false);
        setKeepChanges(false);
    };


    return(
        <FuneralsContext.Provider value={{
            search,
            setSearch,
            showFuneralModal,
            setShowFuneralModal,
            funerals,
            setFunerals,
            refreshTrigger,
            triggerRefresh,
            showDeleteModal,
            setShowDeleteModal,
            deleteTarget,
            setDeleteTarget,
            selectedFuneralItems,
            setSelectedFuneralItems,
            editingItem,
            isEditingFuneralItem,
            addFuneralItem,
            removeFuneralItem,
            updateFuneralItem,
            clearFuneralItems,
            startEditingItem,
            stopEditingItem,
            keepChanges,
            setKeepChanges,
            showFuneralDetail,
            setShowFuneralDetail,
            viewingFuneral,
            setViewingFuneral,
            isEditMode,
            setIsEditMode
        }}>
            {children}
        </FuneralsContext.Provider>
    )
}

export function useFuneralsContext() {
    const context = useContext(FuneralsContext);
    if(!context) throw new Error('useFuneralsContext must be used inside the FuneralsProvider');
    return context;
}