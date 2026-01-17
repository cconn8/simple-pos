"use client";

import React, {useContext, createContext, useState, useEffect} from "react";
import { SelectedFuneralItem } from "../types";

// Filter state structure for clean multi-field filtering
interface FilterState {
    type: string;                    // "Funeral", "Coroner", etc. Empty string = "All Types"
    dateOfDeathYear: string;         // "2024", "2025", etc. Empty string = "All Years"
    dateOfDeathMonth: string;        // "January", "February", etc. Empty string = "All Months"
    commencedWorkYear: string;       // "2024", "2025", etc. Empty string = "All Years"  
    commencedWorkMonth: string;      // "January", "February", etc. Empty string = "All Months"
}

const defaultFilters: FilterState = {
    type: "",
    dateOfDeathYear: "",
    dateOfDeathMonth: "",
    commencedWorkYear: "",
    commencedWorkMonth: ""
};

// localStorage helpers for filter persistence
const FILTER_STORAGE_KEY = 'funeral-filters';

const saveFiltersToStorage = (filters: FilterState) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    }
};

const loadFiltersFromStorage = (): FilterState => {
    if (typeof window !== 'undefined') {
        try {
            const stored = localStorage.getItem(FILTER_STORAGE_KEY);
            return stored ? JSON.parse(stored) : defaultFilters;
        } catch (error) {
            console.warn('Failed to load filters from storage:', error);
            return defaultFilters;
        }
    }
    return defaultFilters;
};

interface FuneralsContextType {
    //states
    search: string;
    filters: FilterState; // Comprehensive filter state
    showFuneralModal : boolean;
    funerals: any[]; // Mix of FuneralData (legacy) and V2 records
    refreshTrigger: number;
    showDeleteModal: boolean;
    deleteTarget: { id: string; name: string } | null;
    selectedFuneralItems: SelectedFuneralItem[];
    editingItem: SelectedFuneralItem | null;
    isEditingFuneralItem: boolean;
    keepChanges : boolean;
    showFuneralDetail: boolean;
    viewingFuneral: any | null; // Can be legacy or V2 format
    editingFuneralData: any | null; // V2 funeral data for editing
    isEditMode: boolean;
    sortField: string | null;
    sortDirection: 'asc' | 'desc' | null;
    // XERO posting modal
    showXeroPostingModal: boolean;
    xeroPostingFuneral: any | null;


    //state setters
    setSearch : (arg: string) => void;
    setFilters : (arg: FilterState) => void;
    updateFilter : (key: keyof FilterState, value: string) => void;
    clearAllFilters : () => void;
    setShowFuneralModal : (arg: boolean) => void;
    setFunerals: (funerals: any[]) => void;
    triggerRefresh: () => void;
    setShowDeleteModal: (show: boolean) => void;
    setDeleteTarget: (target: { id: string; name: string } | null) => void;
    setKeepChanges : (arg: boolean) => void;
    setShowFuneralDetail: (show: boolean) => void;
    setViewingFuneral: (funeral: any | null) => void;
    setEditingFuneralData: (data: any | null) => void;
    setIsEditMode: (isEdit: boolean) => void;
    setSortField: (field: string | null) => void;
    setSortDirection: (direction: 'asc' | 'desc' | null) => void;
    handleSort: (field: string) => void;
    // XERO posting modal setters
    setShowXeroPostingModal: (show: boolean) => void;
    setXeroPostingFuneral: (funeral: any | null) => void;
    
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
    const [filters, setFilters]                     = useState<FilterState>(defaultFilters);
    const [showFuneralModal, setShowFuneralModal]   = useState(false);
    const [funerals, setFunerals]                   = useState<any[]>([]);
    const [refreshTrigger, setRefreshTrigger]       = useState(0);
    const [showDeleteModal, setShowDeleteModal]     = useState(false);
    const [deleteTarget, setDeleteTarget]           = useState<{ id: string; name: string } | null>(null);
    const [selectedFuneralItems, setSelectedFuneralItems] = useState<SelectedFuneralItem[]>([]);
    const [editingItem, setEditingItem]             = useState<SelectedFuneralItem | null>(null);
    const [isEditingFuneralItem, setIsEditingFuneralItem] = useState(false);
    const [keepChanges, setKeepChanges] = useState(false);
    const [showFuneralDetail, setShowFuneralDetail] = useState(false);
    const [viewingFuneral, setViewingFuneral] = useState<any | null>(null);
    const [editingFuneralData, setEditingFuneralData] = useState<any | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
    // XERO posting modal states
    const [showXeroPostingModal, setShowXeroPostingModal] = useState(false);
    const [xeroPostingFuneral, setXeroPostingFuneral] = useState<any | null>(null);


    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Filter management functions
    const updateFilter = (key: keyof FilterState, value: string) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };
            saveFiltersToStorage(newFilters);
            return newFilters;
        });
    };

    const clearAllFilters = () => {
        setFilters(defaultFilters);
        saveFiltersToStorage(defaultFilters);
    };

    // Load filters from localStorage on mount
    useEffect(() => {
        const savedFilters = loadFiltersFromStorage();
        setFilters(savedFilters);
    }, []);

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

    const handleSort = (field: string) => {
        if (sortField === field) {
            // If clicking the same field, toggle direction
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                // Reset to no sort
                setSortField(null);
                setSortDirection(null);
            } else {
                setSortDirection('asc');
            }
        } else {
            // If clicking a different field, set it to ascending
            setSortField(field);
            setSortDirection('asc');
        }
    };


    return(
        <FuneralsContext.Provider value={{
            search,
            setSearch,
            filters,
            setFilters,
            updateFilter,
            clearAllFilters,
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
            editingFuneralData,
            setEditingFuneralData,
            isEditMode,
            setIsEditMode,
            sortField,
            setSortField,
            sortDirection,
            setSortDirection,
            handleSort,
            // XERO posting modal
            showXeroPostingModal,
            setShowXeroPostingModal,
            xeroPostingFuneral,
            setXeroPostingFuneral
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