import React from "react";
import InformationContainer from "../InformationConatiner/InformationContainer";
import ProductsAndServicesContainer from "../ProductsAndServicesContainer/ProductsAndServicesContainer";

export default function MainContent({informationCategories, productAndServicesCategories, selectedItems, setSelectedItems}) {

    return(
        <div id="main-content-div">
            <InformationContainer categories={informationCategories}/>
            <ProductsAndServicesContainer categories={productAndServicesCategories} selectedItems={selectedItems} setSelectedItems={setSelectedItems}/>
        </div>
    )

}