import React, { useState } from 'react';
import { Search } from "@deemlol/next-icons";
import { usePathname, useSearchParams, useRouter} from 'next/navigation';
import { useFuneralsContext } from '@/contexts/FuneralsContext';

interface SearchProps {
    placeholder : string
}

export default function SearchBar(props : SearchProps) {
    const {placeholder} = props; 
    const {search, setSearch} = useFuneralsContext();
 
    return(
        <div className='relative flex flex-1 flex-shrink-0'>
            <label htmlFor='search' className="sr-only">Search</label>
            <input 
                type="text" 
                className="border rounded border-gray-300 px-2" 
                value={search}
                onChange={(e) => {setSearch(e.target.value)}} 
                placeholder={`${placeholder}`} 
            />
        </div>
    )

}