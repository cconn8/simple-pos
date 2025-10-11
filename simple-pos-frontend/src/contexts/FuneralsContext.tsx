"use client";

import React, {useContext, createContext, useState} from "react";
import { FuneralData } from "../types";

interface FuneralsContextType {
    //states
    search: string;
    showFuneralModal : boolean;
    funerals: FuneralData[];
    refreshTrigger: number;
    showDeleteModal: boolean;
    deleteTarget: { id: string; name: string } | null;

    //state setters
    setSearch : (arg: string) => void;
    setShowFuneralModal : (arg: boolean) => void;
    setFunerals: (funerals: FuneralData[]) => void;
    triggerRefresh: () => void;
    setShowDeleteModal: (show: boolean) => void;
    setDeleteTarget: (target: { id: string; name: string } | null) => void;
}

const FuneralsContext = createContext<FuneralsContextType | null>(null)

export function FuneralsProvider({children} : {children: React.ReactNode}) {
    const [search, setSearch] = useState("");
    const [showFuneralModal, setShowFuneralModal] = useState(false);
    const [funerals, setFunerals] = useState<FuneralData[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
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
            setDeleteTarget
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