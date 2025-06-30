import { useState } from "react"
import { RowItem } from "./RowItem";
import { v4 as uuidv4 } from 'uuid';

export function CreateInventoryModal({
                                    isCreateInventoryModalVisible, 
                                    setIsCreateInventoryModalVisible, 
                                    rowItems, 
                                    setRowItems, 
                                    fetchData,
                                    temporaryAddedItem,
                                    setTemporaryAddedItem
                                }) {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // console.log('createInventoryModal here, isModalVisible is set to : ', isCreateInventoryModalVisible);
    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('Submit called - checking for empty rows!');
        console.log('Adding items to state context temporarily')
        setTemporaryAddedItem((prev) => [...prev, ...rowItems]);
        

        const payload = rowItems;
        console.log('payload is  : ', payload);

        try {
            const response = await fetch(`${API_URL}/inventory`,{
                    method: "POST",
                    headers : {
                        "content-type" : "application/json"
                    },
                    body: JSON.stringify(payload)
                }     
            );

            const data = await response.json();
            console.log("Success Message received on the client side - Lets GO!!!:", data);
        } 
        
        catch (error) { console.error("Error submitting funeral data:", error);}

        // refresh the table with a fetch, and close the modal
        await fetchData();
        setIsCreateInventoryModalVisible(!isCreateInventoryModalVisible);
    };

    const handleAddRow = () => {
        const category = rowItems[0].category;
        const type = rowItems[0].type;
        setRowItems((prev) => [
            ...prev, 
            {_id: uuidv4(), name: '' , category: category, type : type, description : '', isBillable : '', price : ''}
        ]); 
    };


    const handleRemoveItem = (id) => {
        console.log('discard button clicked!')
        const updatedItems = rowItems.filter((item) => item._id != id);
        setRowItems(updatedItems);
    }

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...rowItems];
        updatedItems[index][field] = value;
        setRowItems(updatedItems)
    }

    const handleDiscard = () => {
        setRowItems([
            {_id: uuidv4(), name: '' , category : '', type : '', description : '', isBillable : '', price : ''}
        ]);
    }


    return (
        <div id="createInventoryModal" className={`p-2 flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-30 shadow-md rounded-sm w-19/20 h-19/20 flex border ${isCreateInventoryModalVisible ? 'visible' : 'hidden'}`} >
            <div id="modalTopSection" className="flex flex-row justify-between py-5">
                <h2>Add Inventory Item</h2>                  
                <button className="hover:font-bold" onClick={(e) => {setIsCreateInventoryModalVisible(false)}}>X</button>
            </div>

            <div id="modalContent" className="flex flex-row overflow-auto">
                    <form id="createInventoryForm" className="flex-row" onSubmit={handleSubmit}>
                        {/* Item Details */}
                        <div id="formInfoSection" className="flex-col p-2 bg-gray-200 rounded-sm m-1">
                            {rowItems.map( (item, index) => (
                                <RowItem 
                                    key={item._id}
                                    itemData={item}
                                    onChange={(field, value) => handleItemChange(index, field, value)}
                                    handleRemoveItem={(id) => handleRemoveItem(id)}
                                />
                            ))}
                            <button type="button" className="bg-blue-300 text-white p-1 rounded hover:bg-blue-500 m-1" onClick={handleAddRow}>+ Add Row</button>
                        </div>
                        <button type="button" className="bg-red-400 text-white p-1 rounded hover:bg-red-500 m-1" onClick={handleDiscard}>Discard</button>
                        <button type="submit" className="bg-gray-400 text-white p-1 rounded hover:bg-green-500 m-1" onClick={() => handleSubmit}>Save All</button>
                    </form>
                </div>
        </div>
    )
}