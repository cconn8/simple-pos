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

import { useState } from "react"
import Invoice from "../Invoice/Invoice"


const funeralData = [{
    deceasedName : 'John Doe',
    dateOfDeath : '23 March 2025',
    invoice : 'Generate Invoice'
    },{
    deceasedName : 'Jane Doe',
    dateOfDeath : '27 May 2025',
    invoice : 'Generate Invoice'
    },{
    deceasedName : 'Mary Murphy',
    dateOfDeath : '28 January 2025',
    invoice : 'Invoice Link'
    },{
    deceasedName : 'Henry Black',
    dateOfDeath : '23 April 2025',
    invoice : 'Generate Invoice'
    },
]

export default function Dashboard() {

    const [isDrawerVisible, setIsDrawerVisible] = useState(false)

    function onViewButtonClick(isDrawerVisible) {
        setIsDrawerVisible(!isDrawerVisible)
    }

    return(

        <div id="pageContainer" className="flex flex-row p-5">

            {/* MainSidebar */}
            <aside id="mainSidebarContainer" className="top-0 sticky basis-1/8 bg-gray-500">
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
            <div id="mainContentContainer" className="bg-gray-200 flex-auto">
                {/* Top Section */}
                <div id="topSection" className="flex flex-row bg-gray-400 justify-between">
                    <div className="my-2">
                        <h2>Funerals</h2>
                    </div>
                    
                    <div className="m-2 p-2 bold bg-gray-200 rounded-md hover:bg-gray-300"><button>+ Create</button></div>
                </div>

                 {/* Table Section */}
                <div id="tableSection" className="bg-gray-200 my-2">
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Deceased Name</th>
                                <th className="px-4 py-2 text-left">Date of Death</th>
                                <th className="px-4 py-2 text-left">Invoice</th>
                            </tr>
                        </thead>

                        <tbody>
                            {funeralData.map( (data) => (
                                <tr>
                                    <td className="px-4 py-2 text-left border-r">{data.deceasedName}</td>
                                    <td className="px-4 py-2 text-left border-r">{data.dateOfDeath}</td>
                                    <td className="px-4 py-2 text-left border-r">{data.invoice}</td>
                                    <td className="px-4 py-2 text-left underline hover:font-bold">
                                        <button onClick={() => onViewButtonClick(isDrawerVisible)}>View / Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Drawer Section */}
                <aside id="summaryDrawer" className={`transition-all basis-1/3 duration-300 ease-in-out bg-gray-100 p-4 rounded-lg shadow-md ${isDrawerVisible ? 'visible' : 'hidden'}`}>
                    <div className="flex-col">
                        <ul>
                            <li>Summary A</li>
                            <li>Summary B</li>
                            <li>Summary C</li>
                            <li>Summary D</li>
                            <li>Summary E</li>
                        </ul>
                    </div>
                </aside>
        </div>

    )

}