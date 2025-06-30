
import { v4 as uuidv4 } from 'uuid';
import { DisplayGroupTiles } from "./DisplayGroupTiles";
import fetchData from './FuneralDashboard'
import { useState } from 'react';
import { CreateInventoryModal } from '../inventory/CreateInventoryModal';
import { useEffect } from 'react';


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

    if(temporaryAddedItem.length > 0) {
        console.log('adding temporary item to groupedByCategory object - before = ', groupedItemsByCategory)
        temporaryAddedItem.map((item) => {
            if(!groupedItemsByCategory[item.category.toLowerCase()]) groupedItemsByCategory[item.category.toLowerCase()] = [];
            groupedItemsByCategory[item.category.toLowerCase()].push(item);
        })
        console.log('after = ', groupedItemsByCategory)
    }

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
        console.log('Refresh with fetch, formData should be empty : ', formData);
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

            <div id="modalContent" className="flex basis-2/3 flex-row flex-grow overflow-auto">
                <div id="mainModalContent" className='flex basis-2/3'>
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

                        <div id="formInfoSection" className="flex-col p-2 bg-gray-200 rounded-sm m-1">
                            <h2>Funeral Notes & Details</h2>
                            <div id="funeralNotesDiv" className="flex-row justify-between py-5 mx-2">
                                <textarea cols="75" onChange={handleChange} id="funeralNotes" type="textarea" name="funeralNotes" value={formData["funeralNotes"] || "" } placeholder="Funeral Notes" className="bg-white rounded-sm p-2 mx-2"/>
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
                </div>

                {/* Modal Mini Sidebar */}
                <aside id="modalSidebar" className="top-0 sticky flex basis-1/3 flex-col p-2 bg-gray-200 rounded-sm m-1 overflow-auto">
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

                        {formData.funeralNotes && 
                            <div className="bg-white p-1 text-sm"> 
                                <h2 className="font-bold">Notes :</h2>
                                <p>{formData.funeralNotes}</p>
                            </div>
                        }
                    </div>
                    
                    <div id="modalSidebarSelectedItems" className="my-1 mt-3 flex-col">
                        <h2 className="font-bold">Selected Items</h2>
                        {
                            formData.selectedItems && formData.selectedItems.length > 0 ? 
                                formData.selectedItems.map( (item, index) => {
                                    const itemDisplayTitle =
                                        item.qty > 1
                                            ? `${item.name} x ${item.qty} (€${item.price}/unit) : €${item.qty * item.price}`
                                            : `${item.name} : (€${item.price})`;

                                        return (
                                            <div key={index} className="flex flex-row bg-white p-1 my-1 justify-between text-sm">
                                                <h3>{itemDisplayTitle}</h3>
                                                <button onClick={() => handleDeleteSelectedItem(item._id)} className="underline">Delete</button>
                                            </div>
                                )}) : (
                                    <div className="my-2">
                                        <h3>No items selected!</h3>
                                    </div>
                                )
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