/* 
Dashboard
    - MainSidebar
        - Menu
    - MainContent
        - TopSection
        - TableSection
            - Table
            - Drawer
    - CreateFuneralModal
    
*/

import { useEffect, useState } from "react"
import Invoice from "../Invoice/Invoice"
import { v4 as uuidv4 } from 'uuid';



const funeralData = [{
    deceasedName : 'John Doe',
    dateOfDeath : '23 March 2025',
    invoice : 'Generate Invoice',
    clientName : 'Martha Murphy',
    clientPhone : '091 7364839',
    clientAddress : '54 The Meadows, Ballybrit, Galway',
    selectedItems : [{
        billingCategory : 'Product',
        itemCategory : 'Coffin',
    }]
    },{
    deceasedName : 'Jane Doe',
    dateOfDeath : '27 May 2025',
    invoice : 'Generate Invoice',
    clientName : 'Martha Murphy',
    clientPhone : '091 7364839',
    clientAddress : '54 The Meadows, Ballybrit, Galway',
    selectedItems : [{
        billingCategory : 'Product',
        itemCategory : 'Coffin',
    }]
    },{
    deceasedName : 'Mary Murphy',
    dateOfDeath : '28 January 2025',
    invoice : 'Invoice Link',
    clientName : 'Martha Murphy',
    clientPhone : '091 7364839',
    clientAddress : '54 The Meadows, Ballybrit, Galway',
    selectedItems : [{
        billingCategory : 'Product',
        itemCategory : 'Coffin',
    }]
    },{
    deceasedName : 'Henry Black',
    dateOfDeath : '23 April 2025',
    invoice : 'Generate Invoice',
    clientName : 'Martha Murphy',
    clientPhone : '091 7364839',
    clientAddress : '54 The Meadows, Ballybrit, Galway',
    selectedItems : [{
        billingCategory : 'Product',
        itemCategory : 'Coffin',
    }]
    },
]

const inventory = [{
                id : uuidv4(),
                name : "Light Leinster",
                billingCategory: 'product',
                productType: 'coffin',
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                name : "Dark Leinster",
                billingCategory: 'product',
                productType: 'coffin',
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                name : "Timber Leinster",
                billingCategory: 'product',
                productType: 'coffin',
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                name : "Rustic Oak",
                billingCategory: 'product',
                productType: 'coffin',
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                name : "The Kilmacduagh",
                billingCategory: 'product',
                productType: 'coffin',
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                name : "The Galwegian",
                billingCategory: 'product',
                productType: 'coffin',
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                name : "Wax Macroom",
                billingCategory: 'product',
                productType: 'coffin',
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                name : "Wicker Basket",
                billingCategory: 'product',
                productType: 'coffin',
                price : 250,
                currency : "€",
                description : ""
              },
              {
                id : uuidv4(),
                name : "Solid Oak Antique",
                billingCategory: 'product',
                productType: 'coffin',
                price : 250,
                currency : "€",
                description : ""
              }]


export default function Dashboard() {

    const [data, setData] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [summaryItem, setSummaryItem] = useState(null);

    const products = inventory.filter((item) => item.billingCategory == "product");
    
    useEffect( () => {
        fetch('http://localhost:3005/funerals')
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.error('Error fetching data from funerals : ', err));
        console.log('use effect and fetched called');
    }, []);

    if (!data) return <p>Loading...</p>

    function handleOpenDrawer(isDrawerVisible, data) {
        setIsDrawerVisible(!isDrawerVisible)
        setSummaryItem(data)
        console.log('Handle Open Drawer clicked and Summary Item is set : ', data)
    }

    // console.log(data)

    const handleOpenModal= (e) => {
        console.log('Open Modal Handle clicked!')
        e.preventDefault();
        setIsModalVisible(!isModalVisible)
    }

    return(

        <div id="pageContainer" className="flex flex-row p-5">

            {/* MainSidebar */}
            <aside id="mainSidebarContainer" className="top-0 sticky basis-1/8 bg-gray-500 m-1 rounded-sm">
                <div id="sidebarLogo" className="p-2 justify-center">
                    <img src="/offd-logo.png" width="75" height="50"></img>
                </div>
                
                <div id="mainMenu" className="py-5">
                    <div className="m-2 p-1 text-gray-300 border-b border-gray hover:text-white hover:border-white hover:font-bold transition-all duration-300 rounded-sm"><h2>Funerals</h2></div>
                    <div className="m-2 p-1 text-gray-300 border-b border-gray hover:text-white hover:border-white hover:font-bold transition-all duration-300 rounded-sm"><h2>Inventory</h2></div>
                    <div className="m-2 p-1 text-gray-300 border-b border-gray hover:text-white hover:border-white hover:font-bold transition-all duration-300 rounded-sm"><h2>Invoices</h2></div>
                </div>
            </aside>

            {/* MainContent */}
            <div id="mainContentContainer" className="bg-gray-200 flex-auto m-1 rounded-sm">
                {/* Top Section */}
                <div id="topSection" className="flex flex-row bg-gray-400 justify-between  m-1 rounded-sm">
                    <div className="my-2">
                        <h2>Funerals</h2>
                    </div>
                    
                    <button className="m-2 p-2 bold bg-gray-200 rounded-md hover:bg-gray-300" onClick={(e) => {handleOpenModal(e)}}>+ Create</button>
                </div>

                 {/* Table Section */}
                <div id="tableSection" className="bg-gray-300 my-2  m-1 rounded-sm">
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Deceased Name</th>
                                <th className="px-4 py-2 text-left">Date of Death</th>
                                <th className="px-4 py-2 text-left">Invoice</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map( (data) => (
                                <tr key={data._id} className="hover:font-bold">
                                    <td className="px-4 py-2 text-left border-r">{data.formData.deceasedName}</td>
                                    <td className="px-4 py-2 text-left border-r">{data.formData.dateOfDeath}</td>
                                    <td className="px-4 py-2 text-left border-r">{data.formData.invoice }</td>
                                    <td className="px-4 py-2 text-left underline hover:font-bold">
                                        <button onClick={() => handleOpenDrawer(isDrawerVisible, data)}>View / Edit</button>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Drawer Section */}
                <aside id="summaryDrawer" className={`transition-all basis-1/3 duration-500 ease-in-out bg-gray-100 p-4 m-1 rounded-sm ${isDrawerVisible ? 'visible' : 'hidden'}`}>
                    <div id="drawerTopSection" className="flex flex-row py-5 justify-between">
                        <div id="summaryHeading" className="py-5">
                            <h2 className="bold font-lg">Funeral Summary </h2>
                        </div>
                        <div id="x-button">
                            <button className="hover:font-bold" onClick={handleOpenDrawer}>X</button>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div id="summaryContents">
                            <div className="my-1 py-1">
                                <h2><span className="font-bold">Deceased : </span>{summaryItem ? summaryItem.formData.deceasedName : ''}</h2>
                            </div>
                            <div className="my-1 py-1">
                                <h2><span className="font-bold">Date of Death :</span> {summaryItem ? summaryItem.formData.deceasedName : ''}</h2>
                            </div>
                            <div className="my-1 py-1">
                                <h2><span className="font-bold">Client : </span>{summaryItem ? summaryItem.formData.deceasedName : ''}</h2>
                            </div>
                            <div className="my-1 py-1">
                                <h2><span className="font-bold">Client Address :</span> {summaryItem ? summaryItem.formData.deceasedName : ''}</h2>
                            </div>
                        </div>
                    </div>
                </aside>

            {/* CreateFuneralModal */}
            <div id="createFuneralModal" className={`p-10 flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-10 shadow-md rounded-sm w-19/20 h-19/20 flex border ${isModalVisible ? 'visible' : 'hidden'} overflow-scroll`} >
                <div id="modalTopSection" className="flex flex-row justify-between py-5">
                    <h2>Create Funeral</h2>                  
                    <button className="hover:font-bold" onClick={(e) => {handleOpenModal(e)}}>X</button>
                </div>

                <div id="modalContent" className="flex flex-row">

                    <form>
                        {/* Deceased Details */}
                        <div id="formInfoSection" className="flex-col p-2 bg-gray-200 rounded-sm m-1">
                            <h2>Deceased Details</h2>
                            <div id="deceasedDetailsDiv" className="flex-row justify-between py-5 mx-2">
                                <input id="deceasedName" type="text" placeholder="Deceased Name" className="bg-white rounded-sm p-2 mx-2"/>
                                <input id="dateOfDeath" type="date" placeholder="Date of Death"  className="bg-white rounded-sm p-2 mx-2"/>
                                <input id="lastAddress" type="text" placeholder="Last Address"  className="bg-white rounded-sm p-2 mx-2"/>
                            </div>
                        </div>

                        {/* Client Details */}
                        <div id="formInfoSection" className="flex-col p-2 bg-gray-200 rounded-sm m-1">
                            <h2>Client Details</h2>
                            <div id="clientDetailsDiv" className="flex-row justify-between py-5 mx-2">
                                <input id="clientName" type="text" placeholder="Client Name" className="bg-white rounded-sm p-2 mx-2"/>
                                <input id="clientAddress" type="text" placeholder="Client Address"  className="bg-white rounded-sm p-2 mx-2"/>
                                <input id="clientPhone" type="number" placeholder="Phone"  className="bg-white rounded-sm p-2 mx-2"/>
                                <input id="clientEmail" type="email" placeholder="Email"  className="bg-white rounded-sm p-2 mx-2"/>
                            </div>
                        </div>

                        {/* Products & Services */}
                        <div id="productsAndServicesSection" className="flex-col p-2 bg-gray-200 rounded-sm m-1">
                            <h2>Products</h2>
                            {products.map( (product) => (
                                <button  
                                    type="button"
                                    key={product.id || product.name + Date.now()}
                                    className="bg-blue-500 text-white p-8 rounded hover:bg-blue-600 m-1" 
                                    >
                                        {product.name}
                                </button>

                            ))}
                            <button className="bg-red-500 text-white p-3 rounded hover:bg-blue-600 m-1">+ Add Item</button>

                        </div>
                    </form>
                    <aside id="modalSidebar" className="top-0 sticky basis-1/3 flex-col p-2 bg-gray-200 rounded-sm m-1">
                        <div id="modalSidebarHeading">
                            <h2>Funeral Summary</h2>
                        </div>
                        <div id="modalSidebarContent">
                            <div></div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>

    )

}