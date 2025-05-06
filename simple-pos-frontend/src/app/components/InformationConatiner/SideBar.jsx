import React from "react";

export default function SideBar({selectedItems}) {

    return(
        
        <div id="sidebar-container">

            <h1 className="my-5 underline"><b>Selected Items</b></h1>

            <div className="mx-2 my-4 p-4 border" id="selected-items-div">
                <ol>
                    {selectedItems && selectedItems.map( (item, index) => (
                        <li key={item.title + '' + index}>{item.title}</li>
                    ))}
                </ol>
            </div>

        </div>

        
    )
}