import { RowItem } from "../inventory/RowItem";

export function EditItemBeforeSubmitModal({
                                    isEditItemBeforeSubmitModalVisible,
                                    setIsEditItemBeforeSubmitModalVisible,
                                    selectedItem,
                                    setSelectedItem,
                                    formData,
                                    setFormData,
                                    resetState
                                }) {

    console.log('Edit item modal rendered!');

    const handleSubmit = async(e) => {
        if (e && e.preventDefault) e.preventDefault(); 
        setFormData((prev) => {
        const existingItems = prev.selectedItems || []; //creates an empty 'selectedItems : []' array if not exists
        const itemIndex = existingItems.findIndex((existingItem) => existingItem._id === selectedItem._id);
        
        if(itemIndex !== -1) { //item is found
            const updatedItems = [...existingItems];
            const existingItem = updatedItems[itemIndex];
            updatedItems[itemIndex] = {
                ...existingItem,
                qty : (existingItem.qty || 1) + 1,
                displayTitle : `${existingItem.name} (Qty ${existingItem.qty} x €${existingItem.price}/unit)`,
                itemTotal : `${existingItem.qty * existingItem.price}`
            };
            return {
                    ...prev,
                    selectedItems: updatedItems,
                };
            } else {
                // Item not selected - add with qty 1
                return {
                    ...prev,
                    selectedItems: [...existingItems, { ...selectedItem, qty: 1 , displayTitle : selectedItem.name, itemTotal : selectedItem.price}],
                };
            };
    });        
    console.log('updated form data is : ', formData)
    setIsEditItemBeforeSubmitModalVisible(!isEditItemBeforeSubmitModalVisible);
    }

    const handleDiscard = async() => {
        setSelectedItem({});
        setIsEditItemBeforeSubmitModalVisible(!isEditItemBeforeSubmitModalVisible);
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setSelectedItem((prev) => ({
            ...prev,
            [name]:[value]
        }))
        console.log('input changed selectedItem: ', selectedItem);
    }

    return (
        <div id="editItemBeforeSubmitModal" className={`p-2 flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-30 shadow-md rounded-sm w-1/4 h-1/3 flex border ${isEditItemBeforeSubmitModalVisible ? 'visible' : 'hidden'}`} >
            <div id="modalTopSection" className="flex flex-row justify-between py-5">
                <h2>Edit Price</h2>                  
                <button className="hover:font-bold" onClick={(e) => {setIsEditItemBeforeSubmitModalVisible(false)}}>X</button>
            </div>

            <div id="modalContent" className="flex flex-row overflow-auto">
                    <form id="createInventoryForm" className="flex-row" onSubmit={handleSubmit}>
                        {/* Item Details */}
                        <div id="formInfoSection" className="flex-col p-2 bg-gray-200 rounded-sm m-1">
                             <input onChange={handleChange} id="price"  type="number" name="price"  value={selectedItem.price } placeholder="Price"  className="bg-white rounded-sm p-2 mx-2" required/>
                        </div>
                        <button type="button" className="bg-red-400 text-white p-1 rounded hover:bg-red-500 m-1 justify-end" onClick={handleDiscard}>Discard</button>
                        <button type="submit" className="bg-gray-400 text-white p-1 rounded hover:bg-green-500 m-1 justify-end" onClick={() => handleSubmit}>Confirm</button>
                    </form>
                </div>
        </div>
    )
}