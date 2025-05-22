'use client'
import React, { useState } from "react";
import MainContent from "../MainContent/MainContent";
import SideBar from "../SideBar/SideBar";
import { v4 as uuidv4 } from 'uuid';
import Invoice from "../Invoice/Invoice";

const categories = [
      {
        name: 'deceased_details',
        id: uuidv4(),
        type: 'information',
        display_text : "Deceased Details",
        fields : [{
            id : uuidv4(),
            name : "deceased_name",
            display_text: "Deceased Name",
            type : "text"
          },
          {
            id : uuidv4(),
            title : "deceased_date_of_death",
            name: "deceased_date_of_death",
            display_text : "Date of Death",
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
            name: "deceased_last_address",
            display_text : "Last Address",
            type : "text"
          }]},
      {
        name: "client_details",
        id: uuidv4(),
        type: 'information',
        display_text : "Client Details",
        fields : [{
            id : uuidv4(),
            name : "client_name",
            display_text : "Client Name",
            type : "text"
          },
          {
            id : uuidv4(),
            title : "BillingAddress",
            name : "client_billing_address",
            display_text : "Billing Address",
            type : "text"
          },
          {
            id : uuidv4(),
            name : "client_phone_number",
            display_text: "Phone Number",
            type : "integer"
          }]},
      {
        name: "coffin_list",
        id: uuidv4(),
        type: 'product',
        display_text: 'Coffin',
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
                title : "Dark Leinster",
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                title : "Timber Leinster",
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                title : "Rustic Oak",
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
                title : "Wax Macroom",
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                title : "Wicker Basket",
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                title : "Solid Oak Antique",
                price : 250,
                currency : "€",
                description : ""
              }]},
      {
        name : "flower_list",
        id: uuidv4(),
        type: "product",
        display_text: "Flowers",
        items : [{
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
            }]},
        {
          name : "music_list",
          id: uuidv4(),
          type: "service",
          display_text : "Music",          
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
            }
          ]
        }
      ]
    
export default function Layout() {

    const [selectedItems, setSelectedItems] = useState([])
    const [formData, setFormData] = useState({})
    const [funeralId, setFuneralId] = useState()
    const [funeralSaved, setFuneralSaved] = useState(false)

    return(
      <div className="flex">
          <div className="flex-basis-2/3">
            <MainContent
              categories      ={categories}
              selectedItems   ={selectedItems}
              setSelectedItems={setSelectedItems}
              formData        ={formData}
              setFormData     ={setFormData}
              funeralId       ={funeralId}
              setFuneralId    ={setFuneralId}
              funeralSaved    ={funeralSaved}
              setFuneralSaved = {setFuneralSaved}
            />
          </div>

          <div className="flex-basis-1/3">
            <aside className="h-screen sticky top-0 bg-gray-300 p-5 overflow-scroll">
              <SideBar
                selectedItems   ={selectedItems}
                setSelectedItems={setSelectedItems}
                formData        ={formData}
                setFormData     ={setFormData}
                funeralId       ={funeralId}
                setFuneralId    ={setFuneralId}
                funeralSaved    ={funeralSaved}
                setFuneralSaved = {setFuneralSaved}
              />
            </aside>
          </div>
      </div>
    )
}