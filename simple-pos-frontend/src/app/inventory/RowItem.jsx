


export function RowItem({itemData, onChange, handleRemoveItem, defaultCategory, defaultType}) {



    return (
        <div id="itemDiv" className="flex-row justify-between py-5 mx-2 border rounded-sm m-1">
            <input onChange={(e) => onChange('name', e.target.value) } id="itemName" type="text" name="name" value={itemData.name} placeholder="Item Name" className="bg-white rounded-sm p-2 mx-2" required/>
            
            <select onChange={(e) => onChange('category', e.target.value)} id="inventoryCategory"  type="dropdown" name="category" placeholder="Date"  className="bg-white rounded-sm p-2 mx-2"  defaultValue={defaultCategory} required>
                <option name="Inventory Category" value="">Inventory Category</option>
                <option name="product" value="Product">Product</option>
                <option name="service" value="Service">Service</option>
                <option name="disbursement" value="Disbursement">Disbursement</option>
            </select>
            
            <input onChange={(e) => onChange('type', e.target.value) } id="itemType"  type="text" name="type"  value={itemData.type} placeholder="Item Type"  className="bg-white rounded-sm p-2 mx-2" required/>
            
            <input onChange={(e) => onChange('description', e.target.value) } id="itemDescription"  type="text" name="description"  value={itemData.description} placeholder="Description"  className="bg-white rounded-sm p-2 mx-2"/>
            
            <select onChange={(e) => onChange('isBillable', e.target.value) } id="isBillable"  type="dropdown" name="isBillable" placeholder="Billable"  className="bg-white rounded-sm p-2 mx-2" required>
                <option name="isBillable" value="">Billable</option>
                <option name="yes" value="Yes">Yes</option>
                <option name="no" value="No">No</option>
            </select>
            
            <input onChange={(e) => onChange('price', e.target.value)} id="price"  type="text" name="itemPrice"  value={itemData.price } placeholder="Price"  className="bg-white rounded-sm p-2 mx-2" required/>

        <button onClick={() => handleRemoveItem(itemData._id)} className="bg-blue-300 text-white p-1 rounded hover:bg-blue-500 m-1">Remove</button>
        </div>
    )
}