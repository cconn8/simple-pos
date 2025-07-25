'use client';
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Dashboard from "../../funerals/FuneralDashboard";

const categories = [
      {
        name: 'deceasedDetails',
        id: uuidv4(),
        type: 'information',    
        display_text : "Deceased Details",
        fields : [{
            id : uuidv4(),
            name : "deceasedName",
            display_text: "Deceased Name",
            type : "text"
          },
          {
            id : uuidv4(),
            title : "dateOfDeath",
            name: "dateOfDeath",
            display_text : "Date of Death",
            type : "date"
          },
          {
            id : uuidv4(),
            title : "lastAddress",
            display_text: "Last Address",
            type : "text"
          }]
        },
      {
        name: "client_details",
        id: uuidv4(),
        type: 'information',
        display_text : "Client Details",
        fields : [{
            id : uuidv4(),
            name : "clientName",
            display_text : "Client Name",
            type : "text"
          },
          {
            id : uuidv4(),
            title : "billingAddress",
            name : "billingAddress",
            display_text : "Billing Address",
            type : "text"
          },
          {
            id : uuidv4(),
            name : "phoneNumber",
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
                price : 1750,
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
                price : 1750,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                title : "Solid Oak Antique",
                price : 1750,
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
      <Dashboard />
    )
}