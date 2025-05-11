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
        
        <div id="sidebar-container" className="p-5 shadow-md bg-gray-200">

            <h1 className="my-5 underline"><b>Funeral Summary</b></h1>
            <div className="flex flex-row">
                <label>Deceased : {formData.deceased_name}</label>
            </div>

            <h1> Funeral of the late : {formData.deceased_name}</h1>
            
            <h1 className="my-5 underline"><b>Selected Items</b></h1>

            <div className="mx-2 my-4 p-4 border" id="selected-items-div">

                {selectedItems?.length > 0 ? (
                    selectedItems.map( (item, index) => (
                        
                        <div key={item.id || index} className="flex flex-row border my-1">
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