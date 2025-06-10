


export function NewItem({itemData, onChange}) {

    return (
        <div id="itemDiv" className="flex-row justify-between py-5 mx-2 border rounded-sm m-1">
            <input onChange={(e) => onChange('name', e.target.value) } id="itemName" type="text" name="itemName" value={itemData.name} placeholder="Item Name" className="bg-white rounded-sm p-2 mx-2"/>
            
            <select onChange={(e) => onChange('inventoryCategory', e.target.value)} id="inventoryCategory"  type="dropdown" name="inventoryCategory" placeholder="Date"  className="bg-white rounded-sm p-2 mx-2">
                <option name="product" value="product">Product</option>
                <option name="service" value="service">Service</option>
                <option name="disbursement" value="disbursement">Disbursement</option>
            </select>
            
            <input onChange={(e) => onChange('itemCategory', e.target.value) } id="itemCategory"  type="text" name="itemCategory"  value={itemData.itemCategory} placeholder="Item Category"  className="bg-white rounded-sm p-2 mx-2"/>
            
            <input onChange={(e) => onChange('itemDescription', e.target.value) } id="itemDescription"  type="text" name="itemDescription"  value={itemData.description} placeholder="Description"  className="bg-white rounded-sm p-2 mx-2"/>
            
            <select onChange={(e) => onChange('isBillable', e.target.value) } id="isBillable"  type="dropdown" name="isBillable" placeholder="Billable"  className="bg-white rounded-sm p-2 mx-2">
                <option name="yes" value="yes">Yes</option>
                <option name="no" value="no">No</option>
            </select>
            
            <input onChange={(e) => onChange('price', e.target.value)} id="price"  type="text" name="itemPrice"  value={itemData.price } placeholder="Price"  className="bg-white rounded-sm p-2 mx-2"/>

        <button className="bg-blue-300 text-white p-1 rounded hover:bg-blue-500 m-1">Save</button>
        <button className="bg-blue-300 text-white p-1 rounded hover:bg-blue-500 m-1">Remove</button>
        </div>
    )
}