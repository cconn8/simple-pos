import React from "react";


export default function SideBar({setSelectedItems, selectedItems, formData, setFormData}) {

    function onDeleteSelectedItemButtonClick(id) {
        setSelectedItems( (prevItems) => 
            prevItems.filter((item) => item.id !== id)
        );
    }

    function onClearAllButtonClick() {
        setSelectedItems([])
    }
    
    return(

        <div>
            <h1 className="my-5 underline"><b>Funeral Summary</b></h1>
            <div className="flex">
                {formData.deceased_name && <label>Deceased : {formData.deceased_name}</label>}
                {formData.date_of_death && <label>Date of Death : {formData.deceased_dod.format('DD MMM YYYY')}</label>}
                {formData.client_name && <label>Client Name : {formData.client_name}</label>}
                {formData.client_phone && <label>Client Phone : {formData.client_phone}</label>}
            </div>
            
            
            <h1 className="my-5 underline"><b>Selected Items</b></h1>
            <div className="mx-2 my-4 p-4" id="selected-items-div">

                {selectedItems?.length > 0 ? (
                    selectedItems.map( (item, index) => (
                        
                        <div key={item.id + '' + index} className="flex my-2 bg-blue-500 text-white p-2 rounded">
                            <h3 className="mx-1">{item.title} : </h3>
                            <p className="mx-1">{item.currency}{item.price}</p>
                            <button className="mx-1 underline" onClick={( () => onDeleteSelectedItemButtonClick(item.id))}>Delete</button>
                            {console.log('Sidebar item:', item)}
                        </div>
                        )
                    )) : 
                        <div><h3>No items selected</h3></div>
                }

                <div id="sidebar-buttons-dive" className="my-2">
                    <button className="mx-2 underline">Save</button>
                    <button className="mx-2 underline" onClick={() => onClearAllButtonClick()}>Clear All</button>  
                    <button className="mx-2 underline">Generate Invoice</button>  
                </div> 

            </div>
        </div>

        
    )
}