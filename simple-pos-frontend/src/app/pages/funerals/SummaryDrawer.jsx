import { CreateFuneralModal } from "./CreateFuneralModal";


export function SummaryDrawer({summaryItem, isDrawerVisible, setIsDrawerVisible, setIsUpdateFuneralModalVisible, setEditFuneralData }) {



    const openUpdateFuneralModal = async(summaryItem) => {
        setEditFuneralData(summaryItem);
        console.log('Edit Funeral Item set to : ', summaryItem);
        setIsUpdateFuneralModalVisible(true);
    };
    
    return (
        <aside id="summaryDrawer" className={`transition-all basis-1/3 duration-500 ease-in-out bg-gray-100 p-4 m-1 rounded-sm ${isDrawerVisible ? 'visible' : 'hidden'}`}>
                <div id="drawerTopSection" className="flex flex-row py-5 justify-between">
                    <div id="summaryHeading">
                        <h2 className="font-bold font-lg">Funeral Summary </h2>
                    </div>
                    <div>
                        <button className="underline hover:font-bold" onClick={() => openUpdateFuneralModal(summaryItem)}>Edit Funeral</button>
                    </div>
                    <div id="x-button">
                        <button className="hover:font-bold" onClick={() => {setIsDrawerVisible(false)}}>X</button>
                    </div>
                </div>
                <div className="flex-col">
                    <div id="summaryContents">
                        <div className="my-1 py-1">
                            <h2><span className="font-bold">Deceased : </span>{summaryItem ? summaryItem.formData.deceasedName : ''}</h2>
                        </div>
                        <div className="my-1 py-1">
                            <h2><span className="font-bold">Date of Death :</span> {summaryItem ? summaryItem.formData.dateOfDeath : ''}</h2>
                        </div>
                        <div className="my-1 py-1">
                            <h2><span className="font-bold">Client : </span>{summaryItem ? summaryItem.formData.clientName : ''}</h2>
                        </div>
                        <div className="my-1 py-1">
                            <h2><span className="font-bold">Client Address :</span> {summaryItem ? summaryItem.formData.clientAddress : ''}</h2>
                        </div>
                    </div>
                </div>
            </aside>
    )
}