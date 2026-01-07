import { v4 as uuidv4 } from 'uuid';
import { Category } from '@/types';

export const FUNERAL_TABLE_HEADINGS = ['Deceased Name', 'Date of Death', 'Invoice', 'Actions']

// export const FUNERAL_TEMPLATE_FIELDS = [
//   {'name' : 'deceasedName', 'displayText' : 'Name of Deceased', 'type' : 'text', 'placeholder' : 'Deceased Full Name'},
//   {'name' : 'dateOfDeath',  'displayText' : 'Date of Death', 'type' : 'date', 'placeholder' : 'Date of Death'},
//   {'name' : 'lastAddress', 'displayText' : 'Last Address', 'type' : 'text', 'placeholder' : 'Last Address'},
//   {'name' : 'deceasedName', 'displayText' : 'Name of Deceased', 'type' : 'text', 'placeholder' : 'Deceased Full Name'},
//   {'name' : 'deceasedName', 'displayText' : 'Name of Deceased', 'type' : 'text', 'placeholder' : 'Deceased Full Name'},
//   {'name' : 'deceasedName', 'displayText' : 'Name of Deceased', 'type' : 'text', 'placeholder' : 'Deceased Full Name'},
//   {'name' : 'deceasedName', 'displayText' : 'Name of Deceased', 'type' : 'text', 'placeholder' : 'Deceased Full Name'},
//   {'name' : 'deceasedName', 'displayText' : 'Name of Deceased', 'type' : 'text', 'placeholder' : 'Deceased Full Name'},
  
// ]

export const FUNERAL_TEMPLATE_A = {
  sections : [
    { _id : uuidv4(),
      name : 'funeralDetails',
      label : 'Funeral Details',
      fields : [
          {_id : uuidv4(), name : 'deceasedName', label : 'Name of Deceased', type : 'text', placeholder : 'Name of Deceased'},
          {_id : uuidv4(), name : 'dateOfDeath',  label : 'Date of Death', type : 'date', placeholder : 'Date of Death'},
          {_id : uuidv4(), name : 'lastAddress', label : 'Last Address', type : 'text', placeholder : 'Last Address'},
          {_id : uuidv4(), name : 'funeralNotes', label : 'Funeral Notes', type : 'textarea', placeholder : 'Funeral notes'}
      ]
    },
    { _id : uuidv4(),
      name : 'contactDetails',
      label : 'Contact Details',
      contactGroups : [
          {_id: uuidv4(), name: 'contact1', label : 'Contact 1', fields : [
            {_id: uuidv4(), name : 'contactName1' , label : 'Name', type : 'text', placeholder : 'Name'},
            {_id: uuidv4(), name : 'phone1', label : 'Phone', type: 'text', placeholder: 'Phone'}
            ] 
          },
          {_id: uuidv4(), name: 'contact2', label : 'Contact 2', fields : [
            {_id: uuidv4(), name : 'contactName2' , label : 'Name', type : 'text', placeholder : 'Name'},
            {_id: uuidv4(), name : 'phone2', label : 'Phone', type: 'text', placeholder: 'Phone'}
            ] 
          },
        ],
      fields : [
            {_id : uuidv4(), name : 'clientName', label : 'Client Name', type : 'text', placeholder : 'Client Name'},
            {_id : uuidv4(), name : 'clientAddress',  label : 'Client Address', type : 'text', placeholder : 'Client Address'},
            {_id : uuidv4(), name : 'clientPhone', label : 'Client Phone', type : 'text', placeholder : 'Phone'},
      ]
    },
    { _id : uuidv4(),  
      name : 'billingDetails',
      label : 'Billing Details',
      fields : [
            {_id : uuidv4(), name: 'careOf', label : 'C/o', type: 'dropdown', options: ['Mr.', 'Mrs.', 'Ms.', 'The ']},
            {_id : uuidv4(), name : 'billingName', label : 'Billing Name', type : 'text', placeholder : 'Client / family name'},
            {_id : uuidv4(), name : 'billingAddress',  label : 'Billing Address', type : 'text', placeholder : 'Address'},
            {_id : uuidv4(), name : 'fromDate',  label : 'Dates : From', type : 'date', placeholder : 'From Date'},
            {_id : uuidv4(), name : 'toDate',  label : 'Dates : To', type : 'date', placeholder : 'To Date'},
            {_id : uuidv4(), name : 'invoiceNumber',  label : 'Invoice No.', type : 'text', placeholder : 'Invoice Number'},


      ]
    }
  ]
}

//Map the funeral object keys, to display text for the table headings
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
    {'key' : 'paymentStatus', 'displayText': 'Pay Status'},
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