import { v4 as uuidv4 } from 'uuid';
import { Category } from '@/types';

export const FUNERAL_TABLE_HEADINGS = ['Deceased Name', 'Date of Death', 'Invoice', 'Actions']

export const tableDisplayMappings = [
    {'key' : 'deceasedName', 'displayText': 'Deceased Name'},
    {'key' : 'dateOfDeath', 'displayText': 'Date of Death'},
    {'key' : 'lastAddress', 'displayText': 'Last Address'},
    {'key' : 'clientName', 'displayText': 'Client Name'},
    {'key' : 'clientAddress', 'displayText': 'Client Address'},
    {'key' : 'clientPhone', 'displayText': 'Client Phone'},
    {'key' : 'clientEmail', 'displayText': 'Client Email'},
    {'key' : 'funeralNotes', 'displayText': 'Funeral Notes'},
    {'key' : 'selectedItems', 'displayText': 'Selected Items'}, 
    {'key' : 'invoice', 'displayText': 'Invoice'},
]

export const DESIRED_CATEGORY_ORDER: Category[] = [
  { name: 'service', displayName: 'Our Services' }, 
  { name: 'product', displayName: 'Funeral Products' },
  { name: 'disbursement', displayName: 'External Payments on the clients Behalf' }
];

// This is legacy static data that should eventually come from the API
export const LEGACY_CATEGORIES = [
  {
    name: 'deceasedDetails',
    id: uuidv4(),
    type: 'information',    
    display_text: "Deceased Details",
    fields: [{
      id: uuidv4(),
      name: "deceasedName",
      display_text: "Deceased Name",
      type: "text"
    }, {
      id: uuidv4(),
      title: "dateOfDeath",
      name: "dateOfDeath",
      display_text: "Date of Death",
      type: "date"
    }, {
      id: uuidv4(),
      title: "lastAddress",
      display_text: "Last Address",
      type: "text"
    }]
  },
  {
    name: "client_details",
    id: uuidv4(),
    type: 'information',
    display_text: "Client Details",
    fields: [{
      id: uuidv4(),
      name: "clientName",
      display_text: "Client Name",
      type: "text"
    }, {
      id: uuidv4(),
      title: "billingAddress",
      name: "billingAddress",
      display_text: "Billing Address",
      type: "text"
    }, {
      id: uuidv4(),
      name: "phoneNumber",
      display_text: "Phone Number",
      type: "integer"
    }]
  },
  {
    name: "coffin_list",
    id: uuidv4(),
    type: 'product',
    display_text: 'Coffin',
    items: [
      {
        id: uuidv4(),
        title: "Light Leinster",
        price: 250,
        currency: "€",
        description: ""
      },
      {
        id: uuidv4(),
        title: "Dark Leinster",
        price: 1750,
        currency: "€",
        description: ""
      },
      {
        id: uuidv4(),
        title: "Timber Leinster",
        price: 250,
        currency: "€",
        description: ""
      },
      {
        id: uuidv4(),
        title: "Rustic Oak",
        price: 250,
        currency: "€",
        description: ""
      },
      {
        id: uuidv4(),
        title: "The Kilmacduagh",
        price: 250,
        currency: "€",
        description: ""
      },
      {
        id: uuidv4(),
        title: "The Galwegian",
        price: 250,
        currency: "€",
        description: ""
      },
      {
        id: uuidv4(),
        title: "Wax Macroom",
        price: 250,
        currency: "€",
        description: ""
      },
      {
        id: uuidv4(),
        title: "Wicker Basket",
        price: 1750,
        currency: "€",
        description: ""
      },
      {
        id: uuidv4(),
        title: "Solid Oak Antique",
        price: 1750,
        currency: "€",
        description: ""
      }
    ]
  },
  {
    name: "flower_list",
    id: uuidv4(),
    type: "product",
    display_text: "Flowers",
    items: [{
      id: uuidv4(),
      title: "Fresh Floral Arrangements",
      price: 250,
      currency: "€",
      description: ""
    }, {
      id: uuidv4(),
      title: "Standard Coffin Spray",
      price: 250,
      currency: "€",
      description: ""
    }, {
      id: uuidv4(),
      title: "5 x Red Roses",
      price: 250,
      currency: "€",
      description: ""
    }]
  },
  {
    name: "music_list",
    id: uuidv4(),
    type: "service",
    display_text: "Music",          
    items: [
      {
        id: uuidv4(),
        title: "Carla & Carmel",
        price: 250,
        currency: "€",
        description: ""
      },
      {
        id: uuidv4(),
        title: "Frankie Colohan",
        price: 250,
        currency: "€",
        description: ""
      },
      {
        id: uuidv4(),
        title: "Ailbhe Hession",
        price: 250,
        currency: "€",
        description: ""
      }
    ]
  }
];