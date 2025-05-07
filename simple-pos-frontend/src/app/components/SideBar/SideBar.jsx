import React from "react";

export default function SideBar({selectedItems}) {

    return(
        
        <div id="sidebar-container">

            <h1 className="my-5 underline"><b>Selected Items</b></h1>

            <div className="mx-2 my-4 p-4 border" id="selected-items-div">
                {selectedItems && selectedItems.map( (item, index) => (
                    <div key={item + '-' + index} className="flex flex-row border">
                        <h3 className="mx-1">{item.title}</h3>
                        <button className="mx-1 underline">Delete</button>
                    </div>
                ))}
            </div>

        </div>

        
    )
}