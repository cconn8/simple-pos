/* 
Dashboard
    - MainSidebar
        - Menu
    - MainContent
        - TopSection
        - TableSection
            - Table
            - Drawer
    - CreateFuneralModal
    
*/

import { useEffect, useState } from "react"
import Invoice from "../Invoice/Invoice"


const funeralData = [{
    deceasedName : 'John Doe',
    dateOfDeath : '23 March 2025',
    invoice : 'Generate Invoice',
    clientName : 'Martha Murphy',
    clientPhone : '091 7364839',
    clientAddress : '54 The Meadows, Ballybrit, Galway',
    selectedItems : [{
        billingCategory : 'Product',
        itemCategory : 'Coffin',
    }]
    },{
    deceasedName : 'Jane Doe',
    dateOfDeath : '27 May 2025',
    invoice : 'Generate Invoice',
    clientName : 'Martha Murphy',
    clientPhone : '091 7364839',
    clientAddress : '54 The Meadows, Ballybrit, Galway',
    selectedItems : [{
        billingCategory : 'Product',
        itemCategory : 'Coffin',
    }]
    },{
    deceasedName : 'Mary Murphy',
    dateOfDeath : '28 January 2025',
    invoice : 'Invoice Link',
    clientName : 'Martha Murphy',
    clientPhone : '091 7364839',
    clientAddress : '54 The Meadows, Ballybrit, Galway',
    selectedItems : [{
        billingCategory : 'Product',
        itemCategory : 'Coffin',
    }]
    },{
    deceasedName : 'Henry Black',
    dateOfDeath : '23 April 2025',
    invoice : 'Generate Invoice',
    clientName : 'Martha Murphy',
    clientPhone : '091 7364839',
    clientAddress : '54 The Meadows, Ballybrit, Galway',
    selectedItems : [{
        billingCategory : 'Product',
        itemCategory : 'Coffin',
    }]
    },
]

export default function Dashboard() {

    const [data, setData] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [summaryItem, setSummaryItem] = useState(null);
    

    useEffect( () => {
        fetch('http://localhost:3005/funerals')
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.error('Error fetching data from funerals : ', err));
    }, []);

    if (!data) return <p>Loading...</p>

    function onViewButtonClick(isDrawerVisible, data) {
        setIsDrawerVisible(!isDrawerVisible)
        setSummaryItem(data)
        console.log('Summary Item is set : ', data)
    }

    console.log(data)

    return(

        <div id="pageContainer" className="flex flex-row p-5">

            {/* MainSidebar */}
            <aside id="mainSidebarContainer" className="top-0 sticky basis-1/8 bg-gray-500 m-1 rounded-sm">
                <div id="sidebarLogo" className="p-2 justify-center">
                    <img src="/offd-logo.png" width="75" height="50"></img>
                </div>
                
                <div id="mainMenu" className="py-5">
                    <div className="m-2 p-1 bold bg-gray-200 rounded-sm"><h2>Funerals</h2></div>
                    <div className="m-2 p-1 bold bg-gray-200 rounded-sm"><h2>Inventory</h2></div>
                    <div className="m-2 p-1 bold bg-gray-200 rounded-sm"><h2>Invoices</h2></div>
                </div>
            </aside>

            {/* MainContent */}
            <div id="mainContentContainer" className="bg-gray-200 flex-auto m-1 rounded-sm">
                {/* Top Section */}
                <div id="topSection" className="flex flex-row bg-gray-400 justify-between  m-1 rounded-sm">
                    <div className="my-2">
                        <h2>Funerals</h2>
                    </div>
                    
                    <div className="m-2 p-2 bold bg-gray-200 rounded-md hover:bg-gray-300"><button>+ Create</button></div>
                </div>

                 {/* Table Section */}
                <div id="tableSection" className="bg-gray-300 my-2  m-1 rounded-sm">
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Deceased Name</th>
                                <th className="px-4 py-2 text-left">Date of Death</th>
                                <th className="px-4 py-2 text-left">Invoice</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map( (data) => (
                                <tr key={data._id}>
                                    <td className="px-4 py-2 text-left border-r">{data.formData.deceasedName}</td>
                                    <td className="px-4 py-2 text-left border-r">{data.formData.dateOfDeath}</td>
                                    <td className="px-4 py-2 text-left border-r">{data.formData.invoice }</td>
                                    <td className="px-4 py-2 text-left underline hover:font-bold">
                                        <button onClick={() => onViewButtonClick(isDrawerVisible, data)}>View / Edit</button>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Drawer Section */}
                <aside id="summaryDrawer" className={`transition-all basis-1/3 duration-300 ease-in-out bg-gray-100 p-4 m-1 rounded-sm ${isDrawerVisible ? 'visible' : 'hidden'}`}>
                    <div className="flex-col">
                        <div id="summaryHeading" className="py-5">
                            <h2 className="bold font-lg">Funeral Summary </h2>
                        </div>
                        <div id="summaryContents">
                            <div className="my-1 py-1">
                                <h2>Deceased : {summaryItem.formData.deceasedName}</h2>
                            </div>
                            <div className="my-1 py-1">
                                <h2>Date of Death : {summaryItem.formData.dateOfDeath}</h2>
                            </div>
                            <div className="my-1 py-1">
                                <h2>Client : {summaryItem.formData.clientName}</h2>
                            </div>
                            <div className="my-1 py-1">
                                <h2>Client Address : {summaryItem.formData.clientAddress}</h2>
                            </div>
                        </div>
                    </div>
                </aside>
        </div>

    )

}