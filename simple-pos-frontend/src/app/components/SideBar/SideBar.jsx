'use client';

import React from "react";
import { useRouter } from 'next/navigation';


export default function SideBar({setSelectedItems, selectedItems, formData, setFormData, funeralId, funeralSaved, setFuneralSaved}) {

    const router = useRouter();

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

            const response = await fetch(`http://localhost:3005/funerals/${funeralId}`);

            router.push('/invoice')

            if (!response.ok) throw new Error(`Server error: ${response.status}`); 

            const funeralData = await response.json();

            localStorage.setItem('invoiceData', JSON.stringify(funeralData));

            console.log("Invoice data returned :", funeralData);
        }
        catch(error) {
            console.error("Error generating invoice: ", error);
        }
    }
    
    return(

        <div>
            <h1 className="my-5 underline"><b>Funeral Summary</b></h1>
            <div className="grid">
                {formData.deceasedName && <label className="bg-white my-1 p-2 rounded">Deceased : {formData.deceasedName}</label>}
                {formData.dateOfDeath && <label className="bg-white my-1 p-2 rounded">Date of Death : {formData.dateOfDeath}</label>}
                {formData.clientName && <label className="bg-white my-1 p-2 rounded">Client Name : {formData.clientName}</label>}
                {formData.phoneNumber && <label className="bg-white my-1 p-2 rounded">Client Phone : {formData.phoneNumber}</label>}
            </div>
            
            
            <h1 className="my-5 underline"><b>Selected Items</b></h1>
            <div className="my-4" id="selected-items-div">

                {selectedItems?.length > 0 ? (
                    selectedItems.map( (item, index) => (
                        
                        <div key={item.id + '' + index} className="flex justify-around my-2 bg-blue-500 text-white p-2 rounded">
                            <h3 className="my-1">{item.title} : </h3>
                            <p className="my-1">{item.currency}{item.price}</p>
                            <button className="my-1 underline" onClick={( () => onDeleteSelectedItemButtonClick(item.id))}>Delete</button>
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