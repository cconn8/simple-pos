import React from "react";

export default function SideBar({setSelectedItems, selectedItems}) {

    function onDeleteSelectedItemButtonClick(id) {
        setSelectedItems( (prevItems) => 
            prevItems.filter((item) => item.id !== id)
        );
    }

    function onClearAllButtonClick() {
        setSelectedItems()
    }
    
    return(
        
        <div id="sidebar-container">

            <h1 className="my-5 underline"><b>Selected Items</b></h1>

            <div className="mx-2 my-4 p-4 border" id="selected-items-div">

                {selectedItems ? selectedItems.map( (item, index) => (
                        
                        <div key={item.id || index} className="flex flex-row border">
                            <h3 className="mx-1">{item.title} : </h3>
                            <p className="mx-1">{item.currency}{item.price}</p>
                            <button className="mx-1 underline" onClick={( () => onDeleteSelectedItemButtonClick(item.id))}>Delete</button>
                            {console.log('Sidebar item:', item)}
                        </div>
                        )
                    ) : 'No items selected'
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