import { useFunerals } from "@/hooks/useApi";
import React, {useContext, createContext, useState} from "react";


interface FuneralsContextType {
  search: string;
  setSearch: (s: string) => void;
}

const FuneralsContext = createContext<FuneralsContextType | null>(null)

export function FuneralsProvider({children} : {children : React.ReactNode}) {
    const [search, setSearch] = useState("");

    return(
        <FuneralsContext.Provider value={{search, setSearch}}>
            {children}
        </FuneralsContext.Provider>
    )
}

export function useFuneralsContext() {
    const context = useContext(FuneralsContext);
    if(!context) throw new Error('useFuneralsContext must be used inside the FuneralsProvider');
    return context;
}