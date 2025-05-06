'use client';
import React from "react";

export default function ProductsAndServicesContainer({categories}) {

    function handleClick() {
        console.log('Button clicked!');
      };

    return (
        <div id="products-and-services-container">

            {categories.map( (category) => (
                
                <div className="grid" key={category.title} id='product-category-container'>
                    <h2>{category.title}</h2>
                    <div className="border rounded-sm p-5 shadow-md gap-2" id="product-items-container">
                        {category.items.map( (item) => (
                                <button 
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2" 
                                    onClick={handleClick}>
                                        {item.title}
                                </button>
                        ))}
                    </div>
                </div>          
            ))}
        </div>
    )
}