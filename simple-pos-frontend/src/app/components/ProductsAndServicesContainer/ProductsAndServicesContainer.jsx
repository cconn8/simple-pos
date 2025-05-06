'use client';
import React from "react";

export default function ProductsAndServicesContainer({categories}) {

    const handleClick = () => {
        console.log('Button clicked!');
      };

    return (

        <div id="products-and-services-container">

            {categories.map( (category) => (
                
                <div className="m-4 p-4 border" key={category.title} id='product-category-container'>
                    <h2>{category.title}</h2>
                    <div className="flex flex-row mx-2" id="product-items-container">
                        {category.items.map( (item) => (
                            <div className="mx-4 border rounded-sm p-5 shadow-md" key={item.title}>
                                <button className="bg-blue-500" onClick={handleClick}>{item.title}</button>
                            </div>
                        ))}
                    </div>
                </div>          
            ))}
        </div>
    )
}