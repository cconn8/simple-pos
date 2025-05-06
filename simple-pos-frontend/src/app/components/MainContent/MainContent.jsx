import React from "react";
import InformationContainer from "../InformationConatiner/InformationContainer";
import ProductsAndServicesContainer from "../ProductsAndServicesContainer/ProductsAndServicesContainer";

export default function MainContent() {
    const informationCategories = [
        {
        title : "Deceased Details",
          fields : [{
            title : "DeceasedName",
            type : "text"
          },
          {
            title : "DateOfDeath",
            type : "date"
          },
          {
            title : "LastAddress",
            type : "text"
          }]
        },
        {
        title : "Client Details",
          fields : [{
            title : "ClientName",
            type : "text"
          },
          {
            title : "BillingAddress",
            type : "text"
          },
          {
            title : "Phone",
            type : "number"
          }]
        }
      ]

      const productAndServicesCategories = [
        {
          title : "Coffin",
          items : [
            {
              title : "Light Leinster",
            },
            {
              title : "The Kilmacduagh",
            },
            {
              title : "The Galwegian",
            },
            {
              title : "Light Leinster",
            },
            {
              title : "The Kilmacduagh",
            },
            {
              title : "The Galwegian",
            },
            {
              title : "Light Leinster",
            },
            {
              title : "The Kilmacduagh",
            },
            {
              title : "The Galwegian",
            }]
        },
        {
          title : "Flowers",
          items : [
            {
              title : "Fresh Floral Arrangements",
            },
            {
              title : "Standard Coffin Spray",
            },
            {
              title : "5 x Red Roses",
            }]
        },
        {
          title : "Music",
          items : [
            {
              title : "Carla & Carmel",
            },
            {
              title : "Frankie Colohan",
            },
            {
              title : "Ailbhe Hession",
            }]
        },
      ]

    return(
        <>
            <InformationContainer categories={informationCategories}/>
            <ProductsAndServicesContainer categories={productAndServicesCategories} />
            {/* <SideBar /> */}
        </>
    )

}