'use client';
import React, { useState } from "react";
import SideBar from "../SideBar/SideBar";

export default function ProductsAndServicesContainer({categories, selectedItems, setSelectedItems}) {

    function onItemClick(item) {
        console.log('Item Button clicked! Here is what is passed : ', item);
        setSelectedItems((prevItems) => [...prevItems, {...item, id : item.id || item.title + Date.now()}]);
    };

    return (
        <div id="products-and-services-container" className="p-5 shadow-md">

            <h1 className="my-5 underline"><b>Products & Services</b></h1>

            {categories.map( (category) => (
                    
                    <div key={category.id || category.title + Date.now()} className="p-5 gap-2" id="product-items-container">
                        
                        <h2>{category.title}</h2>
                        
                        {category.items.map( (item, index) => (
                            <button  key={item.id || item.title + Date.now()}
                                className="bg-blue-500 text-white p-10 rounded hover:bg-blue-600 m-1" 
                                onClick={ () => onItemClick(item)}>
                                    {item.title}
                            </button>
                        ))}
                        <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-red-600 m-2"> + Add Item</button>
                    </div>
                
            ))}            
        </div>
    )
}