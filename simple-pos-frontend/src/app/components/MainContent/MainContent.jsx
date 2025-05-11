import React from "react";
import InformationContainer from "../InformationConatiner/InformationContainer";
import ProductsAndServicesContainer from "../ProductsAndServicesContainer/ProductsAndServicesContainer";

export default function MainContent({informationCategories, productAndServicesCategories, selectedItems, setSelectedItems, formData, setFormData}) {

    return(
        <div id="main-content-div">
            <InformationContainer categories={informationCategories} formData={formData} setFormData={setFormData}/>
            <ProductsAndServicesContainer categories={productAndServicesCategories} selectedItems={selectedItems} setSelectedItems={setSelectedItems}/>
        </div>
    )

}