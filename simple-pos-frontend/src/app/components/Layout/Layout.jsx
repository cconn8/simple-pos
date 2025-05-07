'use client'
import React, { useState } from "react";
import MainContent from "../MainContent/MainContent";
import SideBar from "../SideBar/SideBar";


export default function Layout() {
    const [selectedItems, setSelectedItems] = useState([]);

    return(
        <div className="mx-4 pd-2 flex">
            <div className="basis-2/3"> 
                <MainContent 
                    selectedItems={selectedItems} 
                    setSelectedItems={setSelectedItems}
                />
            </div>
            <div className="basis-1/3"> 
                <SideBar 
                    selectedItems={selectedItems}
                />
            </div>
        </div>
    )
}