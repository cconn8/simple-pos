


export function RowItem({itemData, onChange, handleRemoveItem}) {

    // console.log('Row Item invoked with data, category, type : ', itemData);

    return (
        <div id="itemDiv" className="flex-row justify-between py-5 mx-2 border rounded-sm m-1">
            <input onChange={(e) => onChange('name', e.target.value) } id="itemName" type="text" name="name" value={itemData.name} placeholder="Item Name" className="bg-white rounded-sm p-2 mx-2" required/>
            
            <select onChange={(e) => onChange('category', e.target.value)} value={itemData.category} id="inventoryCategory"  type="dropdown" name="category" className="bg-white rounded-sm p-2 mx-2" required>
                <option value="">Select Category</option>
                <option value="product">Product</option>
                <option value="service">Service</option>
                <option value="disbursement">Disbursement</option>
            </select>
            
            <input onChange={(e) => onChange('type', e.target.value)} value={itemData.type} id="itemType"  type="text" name="type"  placeholder="Item Type"  className="bg-white rounded-sm p-2 mx-2" required/>
            
            <input onChange={(e) => onChange('description', e.target.value) } id="itemDescription"  type="text" name="description"  value={itemData.description} placeholder="Description"  className="bg-white rounded-sm p-2 mx-2"/>
            
            <select onChange={(e) => onChange('isBillable', e.target.value) } id="isBillable"  type="dropdown" name="isBillable" placeholder="Billable"  className="bg-white rounded-sm p-2 mx-2" required>
                <option name="isBillable" value="">Billable?</option>
                <option name="yes" value="Yes">Yes</option>
                <option name="no" value="No">No</option>
            </select>
            
            <input onChange={(e) => onChange('price', e.target.value)} id="price"  type="number" name="itemPrice"  value={itemData.price } placeholder="Price"  className="bg-white rounded-sm p-2 mx-2" required/>

        <button onClick={() => handleRemoveItem(itemData._id)} className="bg-blue-300 text-white p-1 rounded hover:bg-blue-500 m-1">Remove</button>
        </div>
    )
}