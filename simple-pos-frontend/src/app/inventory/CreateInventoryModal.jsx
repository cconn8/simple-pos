import { useState } from "react"
import { NewItem } from "./NewItem";

export function CreateInventoryModal({formData, setFormData, isModalVisible, setIsModalVisible}) {

    const [categoryDropdown, setCategoryDropdown] = useState('Inventory Category');
    const [rowItems, setRowItems] = useState([
        {id: 0, name: '' , inventoryCategory : '', itemCategory : '', description : '', isBillable : '', price : ''}
    ]);

        
    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('submit!');
        const payload = rowItems;

        try {
            const response = await fetch('http://localhost:3005/inventory',{
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
        setIsModalVisible(!isModalVisible);
    };


    const handleAddItem = () => {
        setRowItems((prev) => [
            ...prev, 
            {id: index + Date.now(), name: '' , inventoryCategory : '', itemCategory : '', description : '', isBillable : '', price : ''}
        ]); 
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...rowItems];
        updatedItems[index][field] = value;
        setRowItems(updatedItems)
    }


    return (
        <div id="createInventoryModal" className={`p-2 flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-10 shadow-md rounded-sm w-19/20 h-19/20 flex border ${isModalVisible ? 'visible' : 'hidden'}`} >
            <div id="modalTopSection" className="flex flex-row justify-between py-5">
                <h2>Add Inventory Item</h2>                  
                <button className="hover:font-bold" onClick={(e) => {setIsModalVisible(false)}}>X</button>
            </div>

            <div id="modalContent" className="flex flex-row overflow-auto">
                    <form id="createInventoryForm" className="overflow-scroll" onSubmit={handleSubmit}>
                        {/* Item Details */}
                        <div id="formInfoSection" className="flex-col p-2 bg-gray-200 rounded-sm m-1">
                            {rowItems.map( (item, index) => (
                                <NewItem 
                                    key={item.id}
                                    itemData={item}
                                    onChange={(field, value) => handleItemChange(index, field, value)}
                                />
                            ))}
                            <button type="button" className="bg-blue-300 text-white p-1 rounded hover:bg-blue-500 m-1" onClick={handleAddItem}>+ Add Item</button>
                        </div>
                    </form>
                </div>
        </div>
    )
}