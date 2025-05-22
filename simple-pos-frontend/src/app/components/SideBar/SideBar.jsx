import React from "react";
import { useRouter } from "next/router";

export default function SideBar({setSelectedItems, selectedItems, formData, setFormData, funeralId, funeralSaved, setFuneralSaved}) {

    function onDeleteSelectedItemButtonClick(id) {
        setSelectedItems( (prevItems) => 
            prevItems.filter((item) => item.id !== id)
        );
    }

    function onClearAllButtonClick() {
        setSelectedItems([])
    }

    async function onGenerateInvoiceButtonClick(funeralId) {
        // Get funeral by id
        try {

            const response = await fetch(`https://localhost:3005/funerals/${funeralId}`);

            if (!response.ok) throw new Error(`Server error: ${response.status}`); 

            const funeralData = await response.json();

            localStorage.getItem(invoiceData, JSON.stringify(funeralData));

            window.location.href = '/invoice';

            console.log("Invoice data returned", funeralData);
        }
        catch(error) {
            console.error("Error generating invoice: ", error);
        }
    }
    
    return(

        <div>
            <h1 className="my-5 underline"><b>Funeral Summary</b></h1>
            <div className="grid">
                {formData.deceased_name && <label className="bg-white my-1 p-2 rounded">Deceased : {formData.deceased_name}</label>}
                {formData.deceased_date_of_death && <label className="bg-white my-1 p-2 rounded">Date of Death : {formData.deceased_date_of_death}</label>}
                {formData.client_name && <label className="bg-white my-1 p-2 rounded">Client Name : {formData.client_name}</label>}
                {formData.client_phone && <label className="bg-white my-1 p-2 rounded">Client Phone : {formData.client_phone}</label>}
            </div>
            
            
            <h1 className="my-5 underline"><b>Selected Items</b></h1>
            <div className="my-4" id="selected-items-div">

                {selectedItems?.length > 0 ? (
                    selectedItems.map( (item, index) => (
                        
                        <div key={item.id + '' + index} className="flex justify-around my-2 bg-blue-500 text-white p-2 rounded">
                            <h3 className="my-1">{item.title} : </h3>
                            <p className="my-1">{item.currency}{item.price}</p>
                            <button className="my-1 underline" onClick={( () => onDeleteSelectedItemButtonClick(item.id))}>Delete</button>
                            {console.log('Sidebar item:', item)}
                        </div>
                        )
                    )) : 
                        <div><h3>No items selected</h3></div>
                }

                <div id="sidebar-buttons-dive" className="my-2">
                    <button form="create-funeral-form" type="submit" className="mx-2 underline">Save</button>
                    <button className="mx-2 underline" onClick={() => onClearAllButtonClick()}>Clear All</button>  
                    
                    {funeralSaved && 
                        <button className="mx-2 underline" onClick={ () => onGenerateInvoiceButtonClick(funeralId)}>Generate Invoice</button>
                    }  
                </div> 

            </div>
        </div>

        
    )
}