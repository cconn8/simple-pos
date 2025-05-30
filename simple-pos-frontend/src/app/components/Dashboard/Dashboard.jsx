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

export default function Dashboard() {

    return(


        <div id="pageContainer" className="flex flex-row p-5">

            {/* MainSidebar */}
            <aside id="mainSidebarContainer" className="top-0 sticky basis-1/8 bg-gray-500">
                <div id="mainMenu">
                    <div className="my-2 bold"><h2>Funerals</h2></div>
                    <div className="my-2 bold"><h2>Inventory</h2></div>
                    <div className="my-2 bold"><h2>Invoices</h2></div>
                </div>
            </aside>

            {/* MainContent */}
            <div id="mainContentContainer" className="basis-7/8 bg-gray-200">
                {/* Top Section */}
                <div id="topSection" className="flex flex-row justify-around">
                    <div className="my-2">
                        <h2>Funerals</h2>
                    </div>
                    
                    <div className="my-2 border hover:bg-gray-300"><button>+ Create</button></div>
                </div>

                <div id="tableSection" className="bg-gray-200 my-2">
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th>Deceased Name</th>
                                <th>Date of Death</th>
                                <th>Invoice</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>John Doe</td>
                                <td>27 May 2025</td>
                                <td>Generate Invoice</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )

}