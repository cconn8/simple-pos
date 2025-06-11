
import { v4 as uuidv4 } from 'uuid';
import { DisplayGroupTiles } from "./DisplayGroupTiles";
import fetchData from './FuneralDashboard'



const inventory = {
    id : uuidv4(),
    categories : [
        {name: 'product', displayText: 'Selection of Funeral Items', displayOrder : 1},
        {name: 'service', displayText: 'Our Services', displayOrder: 0},
        {name: 'disbursement', displayText: 'External Payments on the clients behalf', displayOrder: 2}
    ],
    products : [
        {id : uuidv4(),name : "Light Leinster",     category : 'product' ,  type: 'Coffin', price : 250,    currency : "€", description : "A classic light-toned coffin with a clean, elegant finish for a timeless tribute."},
        {id : uuidv4(),name : "Dark Leinster",      category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : "A rich, dark wood coffin offering a dignified and traditional appearance."},
        {id : uuidv4(),name : "Timber Leinster",    category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : "Crafted from quality timber, this coffin combines rustic charm with durability"},
        {id : uuidv4(),name : "Rustic Oak",         category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : "A natural oak coffin with a rustic finish, ideal for a warm and earthy farewell."},
        {id : uuidv4(),name : "The Kilmacduagh",    category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : "A finely crafted coffin named after Irish heritage, offering traditional style and grace."},
        {id : uuidv4(),name : "The Galwegian",      category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : "A distinguished coffin with regional character and a finely polished finish."},
        {id : uuidv4(),name : "Wax Macroom",        category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : "A wax-finished coffin providing a smooth texture and subtle sheen."},
        {id : uuidv4(),name : "Wicker Basket",      category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : "An eco-friendly, woven coffin for a natural and sustainable burial option."},
        {id : uuidv4(),name : "Solid Oak Antique",  category : 'product',   type: 'Coffin', price : 250,    currency : "€", description : "A solid oak coffin with antique detailing, perfect for a classic and refined memorial."}],
    services : [
        {id : uuidv4(),name : "Hygienic Preparation",          category : 'service' ,  type: 'Embalming', price : 250,    currency : "€", description : "Professional embalming and preparation of the deceased for viewing and services."},
        {id : uuidv4(),name : "Funeral Administration & Bookings",      category : 'service',   type: 'Service fees', price : 250,    currency : "€", description : "Coordination of paperwork, venue bookings, and logistical arrangements."},
        {id : uuidv4(),name : "Service Charge",     category : 'service',   type: 'Service fees', price : 250,    currency : "€", description : "A general fee covering staff, facilities, and operational costs during the funeral process."},
    ],
    disbursements : [
        {id : uuidv4(),name : "Memorial Bookmarks",          category : 'disbursement' ,  type: 'Disbursements', price : 250,    currency : "€", description : "Personalized keepsakes with a tribute to the departed, given to mourners."},
        {id : uuidv4(),name : "Flowers",      category : 'disbursement',   type: 'Disbursements', price : 250,    currency : "€", description : "Floral arrangements provided for the ceremony or graveside as a gesture of remembrance"},
        {id : uuidv4(),name : "Mourning Car",     category : 'disbursement',   type: 'Disbursements', price : 250,    currency : "€", description : "A designated vehicle for close family or mourners, ensuring respectful transport."},
    ]

}


export function CreateFuneralModal({formData, setFormData, isModalVisible, setIsModalVisible}) {


    // Insert Fetch Inventory method here to replace hardcoded data

    const sortedCategories = inventory.categories.sort((a,b) => a.displayOrder - b.displayOrder); // Arrange the product / service categories by displayOrder

    const groupedProductsByType = inventory.products.reduce((acc, product) => {
        if (!acc[product.type]) acc[product.type] = [];
        acc[product.type].push(product);
        return acc;
    }, {});

    const groupedServicesByType = inventory.services.reduce((acc, service) => {
        if(!acc[service.type]) acc[service.type] = [];
        acc[service.type].push(service);
        return acc;
    }, {});

    const groupedDisbursementsByType = inventory.disbursements.reduce((acc, disbursement) => {
        if(!acc[disbursement.type]) acc[disbursement.type] = [];
        acc[disbursement.type].push(disbursement);
        return acc;
    }, {});

    const handleChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        setFormData( (prev) => ({
            ...prev,
            [name] : value
        }));
    };

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

            if (!response.ok) { throw new Error(`Server error: ${response.status}`);}

            const data = await response.json();
            console.log("Success Message received on the client side - Lets GO!!!:", data);
        } 
        
        catch (error) { console.error("Error submitting funeral data:", error);}

        // refresh the table with a fetch, and close the modal
        await fetchData();
        setIsModalVisible(!isModalVisible);
    };

    const handleDeleteSelectedItem = (id) => {
        setFormData( (prevItems) => {
            const updatedSelectedItems = prevItems.selectedItems.filter((item) => item.id != id);
            return {
                ...prevItems,
                selectedItems : updatedSelectedItems
            };
        });
    };

    const handleClearAll = () => {
        setFormData((prev) => {
            return {
                ...prev,
                selectedItems : []
            }
        });
    };

    return (

        <div id="createFuneralModal" className={`p-2 flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-10 shadow-md rounded-sm w-19/20 h-19/20 flex border ${isModalVisible ? 'visible' : 'hidden'}`} >
            <div id="modalTopSection" className="flex flex-row justify-between py-5">
                <h2>Create Funeral</h2>                  
                <button className="hover:font-bold" onClick={(e) => {setIsModalVisible(false)}}>X</button>
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
    )
}