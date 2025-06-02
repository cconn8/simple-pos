"use client"
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
import { DisplayGroupTiles } from "./DisplayGroupTiles";
import { useRouter } from "next/navigation";


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

const inventory = {
    id : uuidv4(),
    categories : [
        {name: 'product', displayText: 'Selection of Funeral Items', displayOrder : 1},
        {name: 'service', displayText: 'Our Services', displayOrder: 0},
        {name: 'disbursement', displayText: 'External Payments on the clients behalf', displayOrder: 2}
    ],
    products : [
        {id : uuidv4(),name : "Light Leinster",     category : 'product' ,  type: 'Coffin', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Dark Leinster",      category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Timber Leinster",    category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Rustic Oak",         category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "The Kilmacduagh",    category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "The Galwegian",      category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Wax Macroom",        category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Wicker Basket",      category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Solid Oak Antique",  category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : ""}],
    services : [
        {id : uuidv4(),name : "Hygienic Preparation",          category : 'service' ,  type: 'Embalming', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Funeral Administration & Bookings",      category : 'service',   type: 'Service fees', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Service Charge",     category : 'service',   type: 'Service fees', price : 250,    currency : "€", description : ""},
    ],
    disbursements : [
        {id : uuidv4(),name : "Memorial Bookmarks",          category : 'disbursement' ,  type: 'Disbursements', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Flowers",      category : 'disbursement',   type: 'Disbursements', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Mourning Car",     category : 'disbursement',   type: 'Disbursements', price : 250,    currency : "€", description : ""},
    ]

}


export default function Dashboard() {

    const [existingFuneralData, setExistingFuneralData] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [summaryItem, setSummaryItem] = useState(null);
    const [formData, setFormData] = useState({});

    const router = useRouter();
    
    useEffect( () => {
        fetch('http://localhost:3005/funerals')
        .then(res => res.json())
        .then(data => setExistingFuneralData(data))
        .catch(err => console.error('Error fetching data from funerals : ', err));
        console.log('use effect and fetched called');
    }, []);

    if (!existingFuneralData) return <p>Loading...</p>

    function handleOpenDrawer(isDrawerVisible, data) {
        setIsDrawerVisible(!isDrawerVisible);
        setSummaryItem(data);
        console.log('Handle Open Drawer clicked and Summary Item is set : ', data);
    };

    const handleOpenModal= (e) => {
        console.log('Open Modal Handle clicked!');
        e.preventDefault();
        setIsModalVisible(!isModalVisible);
    };

    const handleChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        setFormData( (prev) => ({
            ...prev,
            [name] : value
        }));
    };


    function handleDeleteSelectedItem(id) {
        setFormData( (prevItems) => {
            const updatedSelectedItems = prevItems.selectedItems.filter((item) => item.id != id);
            return {
                ...prevItems,
                selectedItems : updatedSelectedItems
            };
        });
    };

    function handleClearAll() {
        setFormData((prev) => {
            return {
                ...prev,
                selectedItems : []
            }
        });
    };

    // Submit form
    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('Submitting form: ', formData)

        const payload = formData;

        try {
            const response = await fetch('http://localhost:3005/funerals', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Success Message received on the client side - Lets GO!!!:", data);
        } 
        
        catch (error) {
                console.error("Error submitting funeral data:", error);
        }

        router.refresh();
    };

    // Arrange the product / service categories by displayOrder
    const sortedCategories = inventory.categories.sort((a,b) => a.displayOrder - b.displayOrder);

    // Group products by type (eg. coffin)
    const groupedProductsByType = inventory.products.reduce((acc, product) => {
        if (!acc[product.type]) acc[product.type] = [];
        acc[product.type].push(product);
        return acc;
    }, {});

    // Group services by type
    const groupedServicesByType = inventory.services.reduce((acc, service) => {
        if(!acc[service.type]) acc[service.type] = [];
        acc[service.type].push(service);
        return acc;
    }, {});

    // Grouped disbursements by type
    const groupedDisbursementsByType = inventory.disbursements.reduce((acc, disbursement) => {
        if(!acc[disbursement.type]) acc[disbursement.type] = [];
        acc[disbursement.type].push(disbursement);
        return acc;
    }, {});



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
                            {existingFuneralData.map( (data) => (
                                <tr key={data._id} className="hover:font-bold" onClick={() => handleOpenDrawer(isDrawerVisible, data)}>
                                    <td className="px-4 py-2 text-left border-r">{data.formData.deceasedName}</td>
                                    <td className="px-4 py-2 text-left border-r">{data.formData.dateOfDeath}</td>
                                    <td className="px-4 py-2 text-left border-r">{data.formData.invoice }</td>
                                    <td className="px-4 py-2 text-left underline hover:font-bold">View / Edit</td>
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
                                <h2><span className="font-bold">Date of Death :</span> {summaryItem ? summaryItem.formData.dateOfDeath : ''}</h2>
                            </div>
                            <div className="my-1 py-1">
                                <h2><span className="font-bold">Client : </span>{summaryItem ? summaryItem.formData.clientName : ''}</h2>
                            </div>
                            <div className="my-1 py-1">
                                <h2><span className="font-bold">Client Address :</span> {summaryItem ? summaryItem.formData.clientAddress : ''}</h2>
                            </div>
                        </div>
                    </div>
                </aside>

            {/* CreateFuneralModal */}
            <div id="createFuneralModal" className={`p-2 flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-10 shadow-md rounded-sm w-19/20 h-19/20 flex border ${isModalVisible ? 'visible' : 'hidden'}`} >
                <div id="modalTopSection" className="flex flex-row justify-between py-5">
                    <h2>Create Funeral</h2>                  
                    <button className="hover:font-bold" onClick={(e) => {handleOpenModal(e)}}>X</button>
                </div>

                <div id="modalContent" className="flex flex-row overflow-auto">
                        <form id="createFuneralForm" className="overflow-scroll" onSubmit={handleSubmit}>
                            {/* Deceased Details */}
                            <div id="formInfoSection" className="flex-col p-2 bg-gray-200 rounded-sm m-1">
                                <h2>Deceased Details</h2>
                                <div id="deceasedDetailsDiv" className="flex-row justify-between py-5 mx-2">
                                    <input onChange={handleChange} id="deceasedName" type="text" name="deceasedName" value={formData["deceasedName"]|| "" } placeholder="Deceased Name" className="bg-white rounded-sm p-2 mx-2"/>
                                    <input onChange={handleChange} id="dateOfDeath"  type="date" name="dateOfDeath"  value={formData["dateOfDeath"] || "" } placeholder="Date"  className="bg-white rounded-sm p-2 mx-2"/>
                                    <input onChange={handleChange} id="lastAddress"  type="text" name="lastAddress"  value={formData["lastAddress"] || "" } placeholder="Last Address"  className="bg-white rounded-sm p-2 mx-2"/>
                                </div>
                            </div>

                            {/* Client Details */}
                            <div id="formInfoSection" className="flex-col p-2 bg-gray-200 rounded-sm m-1">
                                <h2>Client Details</h2>
                                <div id="clientDetailsDiv" className="flex-row justify-between py-5 mx-2">
                                    <input onChange={handleChange} id="clientName" type="text" name="clientName" value={formData["clientName"] || "" } placeholder="Client Name" className="bg-white rounded-sm p-2 mx-2"/>
                                    <input onChange={handleChange} id="clientAddress" type="text" name="clientAddress" value={formData["clientAddress"] || "" } placeholder="Client Address"  className="bg-white rounded-sm p-2 mx-2"/>
                                    <input onChange={handleChange} id="clientPhone" type="number" name="clientPhone" value={formData["clientPhone"] || "" } placeholder="Phone"  className="bg-white rounded-sm p-2 mx-2"/>
                                    <input onChange={handleChange} id="clientEmail" type="email" name="clientEmail" value={formData["clientEmail"] || "" } placeholder="Email"  className="bg-white rounded-sm p-2 mx-2"/>
                                </div>
                            </div>

                            {/* Products & Services */}
                            <div id="productsAndServicesSection" className="flex-col p-2 bg-gray-200 rounded-sm m-1">
                                <h2>Billable Items</h2>
                                
                                
                                {sortedCategories.map( (category) => (
                                    <section key={category.name} className="border-b border-white p-2">

                                        {/* List each product / service group items */}
                                        {category.name === 'product' && <DisplayGroupTiles groupedItemsByType={groupedProductsByType} formData={formData} setFormData={setFormData}/>}       
                                        {category.name === 'service' && <DisplayGroupTiles groupedItemsByType={groupedServicesByType} formData={formData} setFormData={setFormData} />}
                                        {category.name === 'disbursement' && <DisplayGroupTiles groupedItemsByType={groupedDisbursementsByType} formData={formData} setFormData={setFormData} />}

                                        <button className="bg-red-500 text-white p-3 rounded hover:bg-blue-600 m-1">+ Add Item</button>

                                    </section>
                                ))}

                            </div>
                        </form>

                    {/* Modal Mini Sidebar */}
                    <aside id="modalSidebar" className="top-0 sticky basis-1/2 flex-col p-2 bg-gray-200 rounded-sm m-1 overflow-auto">
                        <div id="modalSidebarHeading" className="my-1">
                            <h2 className="font-bold">Funeral Summary</h2>
                        </div>

                        <div id="modalSidebarContent">
                            {/* Deceased Detail Summary */}
                            {formData.deceasedName && 
                                <div className="bg-white p-1 text-sm"> 
                                    <h2><span className="font-bold">Deceased :</span> {formData.deceasedName}</h2>
                                </div>
                            }

                            {formData.dateOfDeath && 
                                <div className="bg-white p-1 text-sm"> 
                                    <h2><span className="font-bold">D.O.D :</span> {formData.dateOfDeath}</h2>
                                </div>
                            }

                            {formData.lastAddress && 
                                <div className="bg-white p-1 text-sm"> 
                                    <h2><span className="font-bold">Last Address :</span> {formData.lastAddress}</h2>
                                </div>
                            }

                            {/* Client Detail Summary */}
                            {formData.clientName && 
                                <div className="bg-white p-1 text-sm mt-3"> 
                                    <h2><span className="font-bold">Client :</span> {formData.clientName}</h2>
                                </div>
                            }

                            {formData.clientAddress && 
                                <div className="bg-white p-1 text-sm"> 
                                    <h2><span className="font-bold">Client Addr :</span> {formData.clientAddress}</h2>
                                </div>
                            }

                            {formData.clientPhone && 
                                <div className="bg-white p-1 text-sm"> 
                                    <h2><span className="font-bold">Phone :</span> {formData.clientPhone}</h2>
                                </div>
                            }

                            {formData.clientEmail && 
                                <div className="bg-white p-1 text-sm"> 
                                    <h2><span className="font-bold">Email :</span> {formData.clientEmail}</h2>
                                </div>
                            }
                        </div>
                        
                        <div id="modalSidebarSelectedItems" className="my-1 mt-3 flex-col">
                            <h2 className="font-bold">Selected Items</h2>
                            {formData.selectedItems ? (
                                formData.selectedItems.map( (item, index) => (
                                    <div key={index} className="flex flex-row bg-white p-1 my-1 justify-between text-sm"> 
                                        <h2>{item.name} : €{item.price}</h2>
                                        <button onClick={() => {handleDeleteSelectedItem(item.id)}} className="underline">Delete</button>
                                    </div>
                                ))) :
                                    <div className="my-2"><h3>No items selected!</h3></div>
                            }
                        </div>
                        <div id="buttonsDiv" className="flex flex-row justify-around">
                            <button id="saveFuneralButton" type="submit" form="createFuneralForm" className="m-5 underline hover:font-bold justify-center align-bottom">Save</button>
                            <button id="clearAllButton" onClick={handleClearAll} className="m-5 underline hover:font-bold justify-center align-bottom">Clear All</button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>

    )

}