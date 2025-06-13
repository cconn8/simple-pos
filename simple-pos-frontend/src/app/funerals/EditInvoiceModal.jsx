


export function EditInvoiceModal({isEditInvoiceModalVisible, setIsEditInvoiceModalVisible, editInvoiceData, setEditInvoiceData, setInvoiceLoading, funeralId, deceasedName, fetchData, setIsDrawerVisible, setIsModalVisible}) {

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('Invoice confirmed, generating an invoice ...')
        setIsEditInvoiceModalVisible(false);
        setInvoiceLoading(funeralId)
        const payload = editInvoiceData;
        console.log('sending body payload to server: ', payload);
        try {
            const response = await fetch(`https://simple-pos-nest-backend-q4npngatjq-nw.a.run.app/invoice/${funeralId}`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) { throw new Error('Failed to generate Invoice')};
            
            const data = await response.json();
            console.log('Invoice URL:', data.url);

        } catch (error) {
            console.error('Error:', error);
        }

        setInvoiceLoading(null)
        await fetchData();
        setIsDrawerVisible(false);
        setIsModalVisible(false);
        setEditInvoiceData({})
    }

    const handleChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        setEditInvoiceData( (prev) => ({
            ...prev,
            [name] : value
        }));
    };


    return(
            <div id="editInvoiceModal" className={`p-2 flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-10 shadow-md rounded-sm w-3/4 h-3/4 flex border ${isEditInvoiceModalVisible ? 'visible' : 'hidden'}`} >
                <div id="modalTopSection" className="flex flex-row justify-between py-5 w-full">
                    <h2>Funeral of the late {deceasedName}</h2>                  
                    <button className="hover:font-bold" onClick={(e) => {setIsEditInvoiceModalVisible(false)}}>X</button>
                </div>

                <div id="invoiceModalContent" className="flex">
                    <form id="editInvoiceForm" onSubmit={handleSubmit}>
                        {/* Deceased Details */}
                        <div id="formInfoSection" className="flex flex-col p-2 bg-blue-200 rounded-sm m-1 border border-white">
                            <div id="invoiceDetailsDiv" className="flex-row justify-between py-5 mx-2">
                                <label>Dates of Services : </label>
                                <input onChange={handleChange} id="fromDate"  type="date" name="fromDate"  value={editInvoiceData["fromDate"] || ""} placeholder="From"  className="bg-white rounded-sm p-2 mx-2" required/>
                                <input onChange={handleChange} id="toDate"  type="date" name="toDate"  value={editInvoiceData["toDate"] || ""} placeholder="To"  className="bg-white rounded-sm p-2 mx-2" required/>

                                <label>Invoice Number: </label>
                                <input onChange={handleChange} id="invoiceNumber" type="number" name="invoiceNumber" value={editInvoiceData["invoiceNumber"] || ""} placeholder="Inv Number" className="bg-white rounded-sm p-2 mx-2" required/>
                            </div>
                            
                            <div id="clientDetailsDiv" className="flex-row justify-between py-5 mx-2">
                                <label>Care Of : </label>
                                <select onChange={handleChange} id="misterMisses"  type="dropdown" name="misterMisses"  value="" placeholder="Mr. / Mrs."  className="bg-white rounded-sm p-2 mx-2" required>
                                    <option name="mr" value="Mr.">Mr.</option>
                                    <option name="ms" value="Ms.">Ms.</option>
                                    <option name="mrs" value="Mrs.">Mrs.</option>
                                </select>
                                <input onChange={handleChange} id="clientName"  type="text" name="clientName"  value={editInvoiceData["clientName"] || ""} placeholder="Client Name"  className="bg-white rounded-sm p-2 mx-2" required/>
                            </div>

                            <div id="clientDetailsDiv" className="flex-row justify-between py-5 mx-2">
                                    <label>Address</label>
                                    <div className="flex flex-col">
                                        <input onChange={handleChange} id="addressLineOne" type="text" name="addressLineOne" value={editInvoiceData["addressLineOne"] || ""} placeholder="Address Line 1" className="bg-white rounded-sm p-2 mx-2 my-1" required/>
                                        <input onChange={handleChange} type="text" name="addressLineTwo" value={editInvoiceData["addressLineTwo"] || ""} placeholder="Address Line 2" className="bg-white rounded-sm p-2 mx-2 my-1"/>
                                        <input onChange={handleChange} type="text" placeholder="Address Line 3"name="addressLineThree" value={editInvoiceData["addressLineThree"] || ""}  className="bg-white rounded-sm p-2 mx-2 my-1"/>
                                    </div>

                            </div>
                        </div>
                        <button type="submit" className="p-3 bg-gray-500 bold rounded-md text-white">Confirm</button>
                    </form>
                </div>
            </div>
    );
}