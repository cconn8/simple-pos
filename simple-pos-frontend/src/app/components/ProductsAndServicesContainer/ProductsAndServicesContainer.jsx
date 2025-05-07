'use client';
import React, { useState } from "react";
import SideBar from "../SideBar/SideBar";

export default function ProductsAndServicesContainer({categories, selectedItems, setSelectedItems}) {

    function onItemClick(item) {
        console.log('Item Button clicked!');
        setSelectedItems( (prev) => [...prev, item]);
        };

    return (
        <div id="products-and-services-container">

            <h1 className="my-5 underline"><b>Products & Services</b></h1>

            {categories.map( (category) => (
                
                <div className="my-4 p-4 border" key={category.id} id='product-category-container'>
                    <h2>{category.title}</h2>
                    <div className="p-5 shadow-md gap-2" id="product-items-container">
                        {category.items.map( (item, index) => (
                                <button  key={item.id}
                                    className="bg-blue-500 text-white p-10 rounded hover:bg-blue-600 m-1" 
                                    onClick={ () => onItemClick(item)}>
                                        {item.title}
                                </button>
                        ))}
                        <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-red-600 m-2"> + Add Item</button>
                    </div>
                </div>          
            ))}            
        </div>
    )
}