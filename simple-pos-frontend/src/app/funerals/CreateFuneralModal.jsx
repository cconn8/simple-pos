
import { v4 as uuidv4 } from 'uuid';
import { DisplayGroupTiles } from "./DisplayGroupTiles";
import fetchData from './FuneralDashboard'
import { useState } from 'react';
import { CreateInventoryModal } from '../inventory/CreateInventoryModal';
import { useEffect } from 'react';

const tempInventory = [
        {id : uuidv4(),name : "The Connacht Lightwood",     category : 'product' ,  type: 'Coffin', price : 1350,    currency : "€", description : "A discrete Semi-Solid coffin with high light gloss finish, fitted with golden ring mountings"},
        {id : uuidv4(),name : "The Connacht Chestnut",     category : 'product' ,  type: 'Coffin', price : 1350,    currency : "€", description : "A discrete Semi-Solid coffin with chestnut finish, fitted with oscar mountings"},
        {id : uuidv4(),name : "The Connacht Mahogany",     category : 'product' ,  type: 'Coffin', price : 1350,    currency : "€", description : "A discrete Semi-Solid coffin with a rich mahogany finish, fitted with golden ring mountings"},
        {id : uuidv4(),name : "The Galwegian",      category : 'product',   type: 'Coffin', price : 1350,    currency : "€", description : "A discrete Semi-Solid coffin with a natural matte finish, fitted with timber mountings"},
        {id : uuidv4(),name : "Whitestrand Oak",    category : 'product',   type: 'Coffin', price : 1350,    currency : "€", description : "Profiled sided semi solid oak coffin with hand wax finish and fitted with continuous solid oak mountings"},
        {id : uuidv4(),name : "Wicker Basket",      category : 'product',   type: 'Coffin', price : 1500,    currency : "€", description : "Beautifully woven eco friendly wicker styled coffin with rope interlace and mountings"},
        {id : uuidv4(),name : "Rustic Oak",         category : 'product',   type: 'Coffin', price : 2300,    currency : "€", description : "Solid oak, Italian styled coffin with matt rustic finish, fitted with wooden barrel mountings"},
        {id : uuidv4(),name : "Eyre Mahogany",         category : 'product',   type: 'Coffin', price : 2500,    currency : "€", description : "Italian styled, solid mahogany coffin, with sides profiled in gold inlay beeding and fitted with brass barrel mountings"},
        {id : uuidv4(),name : "The Kilmacduagh",    category : 'product',   type: 'Coffin', price : 1750,    currency : "€", description : "Beautifully paneled semi solid oak coffin with raised celtic cross and fitted with twisted brass mountings"},
        {id : uuidv4(),name : "Our Lady of Lourdes",    category : 'product',   type: 'Coffin', price : 1750,    currency : "€", description : "Semi solid oak coffin with high gloss finish, our lady of lourdes figures, fitted with twisted brass mountings"},
        {id : uuidv4(),name : "The Last Supper",    category : 'product',   type: 'Coffin', price : 1750,    currency : "€", description : "Semi solid oak coffin with high gloss finish, the last supper figures, fitted with twisted brass mountings"},
        {id : uuidv4(),name : "Connemara Oak",  category : 'product',   type: 'Coffin', price : 1950,    currency : "€", description : "Beautifully profiled solid oak coffin, with clear high gloss finish and fitted with antique mountings"},
        {id : uuidv4(),name : "Connemara Oak Antique",  category : 'product',   type: 'Coffin', price : 1950,    currency : "€", description : "Beautifully profiled solid oak coffin, with clear high gloss finish and fitted with golden barrel mountings"},
        {id : uuidv4(),name : "Music by Carla Merrigan & Carmel Kelly (Pianist / Vocalist)",          category : 'disbursement' ,  type: 'Music', price : 300,    currency : "€", description : ""},
        {id : uuidv4(),name : "Music by Ailbhe Hession (Pianist / Vocalist)",          category : 'disbursement' ,  type: 'Music', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Music by Frank Naughton (Vocalist)",          category : 'disbursement' ,  type: 'Music', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Music by Frankie Colohan (Vocalist)",          category : 'disbursement' ,  type: 'Music', price : 200,    currency : "€", description : "."},
        {id : uuidv4(),name : "Music by Colm Henry (Pianist)",          category : 'disbursement' ,  type: 'Music', price : 200,    currency : "€", description : ""},
        {id : uuidv4(),name : "50 X Wallet Cards",          category : 'disbursement' ,  type: 'Memorial Cards', price : 100,    currency : "€", description : ""},
        {id : uuidv4(),name : "100 X Wallet Cards",          category : 'disbursement' ,  type: 'Memorial Cards', price : 120,    currency : "€", description : ""},
        {id : uuidv4(),name : "150 X Wallet Cards",          category : 'disbursement' ,  type: 'Memorial Cards', price : 160,    currency : "€", description : ""},
        {id : uuidv4(),name : "200 X Wallet Cards",          category : 'disbursement' ,  type: 'Memorial Cards', price : 190,    currency : "€", description : ""},
        {id : uuidv4(),name : "50 X Mass Booklets",          category : 'disbursement' ,  type: 'Memorial Cards', price : 150,    currency : "€", description : ""},
        {id : uuidv4(),name : "100 X Mass Booklets",          category : 'disbursement' ,  type: 'Memorial Cards', price : 220,    currency : "€", description : ""},
        {id : uuidv4(),name : "150 X Mass Booklets",          category : 'disbursement' ,  type: 'Memorial Cards', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "A4 Book of Condolence",          category : 'disbursement' ,  type: 'Memorial Cards', price : 100,    currency : "€", description : ""},
        {id : uuidv4(),name : "Fresh Floral Spray",      category : 'disbursement',   type: 'Flowers', price : 130,    currency : "€", description : ""},
        {id : uuidv4(),name : "2 x Roses",      category : 'disbursement',   type: 'Flowers', price : 10,    currency : "€", description : ""},
        {id : uuidv4(),name : "5 x Roses",      category : 'disbursement',   type: 'Flowers', price : 23,    currency : "€", description : ""},
        {id : uuidv4(),name : "Professional Livestreaming",      category : 'disbursement',   type: 'Other', price : 23,    currency : "€", description : ""},
        {id : uuidv4(),name : "Mourning Car",     category : 'disbursement',   type: 'Other', price : 250,    currency : "€", description : ""},
        {id : uuidv4(),name : "Irish Times",     category : 'disbursement',   type: 'Other', price : 350,    currency : "€", description : ""},
        {id : uuidv4(),name : "Large Print & Frame - Cregal Art",     category : 'disbursement',   type: 'Other', price : 150,    currency : "€", description : ""},
        {id : uuidv4(),name : "Small Print & Frame",     category : 'disbursement',   type: 'Other', price : 25,    currency : "€", description : ""},
        {id : uuidv4(),name : "RIP.ie",     category : 'disbursement',   type: 'Other', price : 128,    currency : "€", description : ""},
        {id : uuidv4(),name : "Service Charge €2200",      category : 'service',   type: 'Service fees', price : 2200,    currency : "€", description : "Coordination of paperwork, venue bookings, and logistical arrangements."},
        {id : uuidv4(),name : "Service Charge €2500",     category : 'service',   type: 'Service fees', price : 2500,    currency : "€", description : "A general fee covering staff, facilities, and operational costs during the funeral process."},
        {id : uuidv4(),name : "Service Charge €2700",     category : 'service',   type: 'Service fees', price : 2500,    currency : "€", description : "A general fee covering staff, facilities, and operational costs during the funeral process."},
        {id : uuidv4(),name : "Service Charge €3000",     category : 'service',   type: 'Service fees', price : 2500,    currency : "€", description : "A general fee covering staff, facilities, and operational costs during the funeral process."},
    ];


export function CreateFuneralModal({
                                    formData, 
                                    setFormData, 
                                    isCreateFuneralModalVisible, 
                                    setIsCreateFuneralModalVisible, 
                                    fetchData, 
                                    isCreateInventoryModalVisible, 
                                    setIsCreateInventoryModalVisible, 
                                    rowItems, 
                                    setRowItems,
                                    temporaryAddedItem,
                                    setTemporaryAddedItem
                                }) {


    // Insert Fetch Inventory method here to replace hardcoded data
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // state
    const [inventoryData, setInventoryData] = useState([]);

    const fetchInventory = async() => {
        console.log(`fetching inventory from ${API_URL}/inventory`);
        try {
            const res = await fetch(`${API_URL}/inventory`);
            const data = await res.json();

            if (Array.isArray(data)) {
                    console.log('inventory received is : ', data)
                    setInventoryData(data) ;
                } else {
                console.error('Inventory array received is empty : ', data);
            }
        } catch (err) {
            console.error('Error fetching data from inventory:', err);
        }

    }
    useEffect( () => {
            fetchInventory();
     }, []);

    // Desired category order sets the order of categories presented to the user when creating a funeral
    const desiredCategoryOrder = [
        {'name' : 'service', 'displayName' : 'Our Services'}, 
        {'name' : 'product', 'displayName' : 'Funeral Products'},
        {'name' : 'disbursement', 'displayName' : 'External Payments on the clients Behalf'}
    ]

    const groupedItemsByCategory = inventoryData.reduce((acc, item) => {
        if (!acc[item.category.toLowerCase()]) acc[item.category.toLowerCase()] = [];
        try{
            acc[item.category].push(item);
         } catch {
            console.log('no items to push to groups yet');
         }
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
            const response = await fetch(`${API_URL}/funerals`, {
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
        setIsCreateFuneralModalVisible(!isCreateFuneralModalVisible);
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

        <div id="createFuneralModal" className={`p-2 flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-5 shadow-md rounded-sm w-19/20 h-19/20 flex border ${isCreateFuneralModalVisible ? 'visible' : 'hidden'}`} >
            <div id="modalTopSection" className="flex flex-row justify-between py-5">
                <h2>Create Funeral</h2>                  
                <button className="hover:font-bold" onClick={(e) => {setIsCreateFuneralModalVisible(false)}}>X</button>
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

                            {desiredCategoryOrder.map((category) => (
                                <section key={category.name} className="border-b border-white p-2">
                                    <h3 className="text-lg font-bold">{category.displayName.toUpperCase()}</h3>
                                    {/* {console.log(`grouped by type for this section ${category.name} is : `, groupedItemsByCategory[category.name])} */}

                                    <DisplayGroupTiles 
                                        items={groupedItemsByCategory[category.name] || []} 
                                        formData={formData} 
                                        setFormData={setFormData} 
                                        category={category.name}
                                        rowItems={rowItems}
                                        setRowItems={setRowItems}
                                        isCreateInventoryModalVisible={isCreateInventoryModalVisible}
                                        setIsCreateInventoryModalVisible={setIsCreateInventoryModalVisible}
                                        temporaryAddedItem={temporaryAddedItem}
                                        setTemporaryAddedItem={setTemporaryAddedItem}
                                    />
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

            <CreateInventoryModal
                isCreateInventoryModalVisible={isCreateInventoryModalVisible}
                setIsCreateInventoryModalVisible={setIsCreateInventoryModalVisible}
                rowItems={rowItems}
                setRowItems={setRowItems}
                fetchData={fetchData}
                temporaryAddedItem={temporaryAddedItem}
                setTemporaryAddedItem={setTemporaryAddedItem}
            />

        </div>
    )
}