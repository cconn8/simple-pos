'use client'
import React, { useState } from "react";
import MainContent from "../MainContent/MainContent";
import SideBar from "../SideBar/SideBar";
import { v4 as uuidv4 } from 'uuid';


export default function Layout() {
    const [selectedItems, setSelectedItems] = useState([])
    const informationCategories = [
        {
        title : "Deceased Details",
        id: uuidv4(),
          fields : [{
            id : uuidv4(),
            title : "DeceasedName",
            type : "text"
          },
          {
            id : uuidv4(),
            title : "DateOfDeath",
            type : "date"
          },
          {
            id : uuidv4(),
            title : "LastAddress",
            type : "text"
          }]
        },
        {
        title : "Client Details",
        id: uuidv4(),
          fields : [{
            id : uuidv4(),
            title : "ClientName",
            type : "text"
          },
          {
            id : uuidv4(),
            title : "BillingAddress",
            type : "text"
          },
          {
            id : uuidv4(),
            title : "Phone",
            type : "number"
          }]
        }
      ]
    const productAndServicesCategories = [
      {
        title : "Coffin",
        id: uuidv4(),
        items : [
          {
            id : uuidv4(),
            title : "Light Leinster",
            price : 250,
            currency : "€",
            description : ""
          },
          {
            id : uuidv4(),
            title : "The Kilmacduagh",
            price : 250,
            currency : "€",
            description : ""
          },
          {
            id : uuidv4(),
            title : "The Galwegian",
            price : 250,
            currency : "€",
            description : ""
          },
          {
            id : uuidv4(),
            title : "Light Leinster",
            price : 250,
            currency : "€",
            description : ""
          },
          {
            id : uuidv4(),
            title : "The Kilmacduagh",
            price : 250,
            currency : "€",
            description : ""
          },
          {
            id : uuidv4(),
            title : "The Galwegian",
            price : 250,
            currency : "€",
            description : ""
          },
          {
            id : uuidv4(),
            title : "Light Leinster",
            price : 250,
            currency : "€",
            description : ""
          },
          {
            id : uuidv4(),
            title : "The Kilmacduagh",
            price : 250,
            currency : "€",
            description : ""
          },
          {
            id : uuidv4(),
            title : "The Galwegian",
            price : 250,
            currency : "€",
            description : ""
          }]
      },
      {
        title : "Flowers",
        id: uuidv4(),
        items : [
          {
            id : uuidv4(),
            title : "Fresh Floral Arrangements",
            price : 250,
            currency : "€",
            description : ""
          },
          {
            id : uuidv4(),
            title : "Standard Coffin Spray",
            price : 250,
            currency : "€",
            description : ""
          },
          {
            id : uuidv4(),
            title : "5 x Red Roses",
            price : 250,
            currency : "€",
            description : ""
          }]
      },
      {
        title : "Music",
        id: uuidv4(),
        items : [
          {
            id : uuidv4(),
            title : "Carla & Carmel",
            price : 250,
            currency : "€",
            description : ""
          },
          {
            id : uuidv4(),
            title : "Frankie Colohan",
            price : 250,
            currency : "€",
            description : ""
          },
          {
            id : uuidv4(),
            title : "Ailbhe Hession",
            price : 250,
            currency : "€",
            description : ""
          }]
      },
    ]

    return(
        <div className="mx-4 pd-2 flex">
            <div className="basis-2/3"> 
                <MainContent 
                    informationCategories={informationCategories}
                    productAndServicesCategories={productAndServicesCategories}
                    selectedItems={selectedItems} 
                    setSelectedItems={setSelectedItems}
                />
            </div>
            <div className="basis-1/3"> 
                <SideBar 
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                />
            </div>
        </div>
    )
}