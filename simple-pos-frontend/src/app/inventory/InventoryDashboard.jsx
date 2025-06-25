"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import MainSidebar from "../components/MainSidebar/MainSidebar";
import { CreateInventoryModal } from "./CreateInventoryModal";
import { v4 as uuidv4 } from 'uuid';



export default function InventoryDashboard() {

    const [inventoryData, setInventoryData] = useState([]);
    const [isCreateInventoryModalVisible, setIsCreateInventoryModalVisible] = useState(false);
    const [rowItems, setRowItems] = useState([
        {_id: uuidv4(), name: '' , category : '', type : '', description : '', qty: 1, isBillable : '', price : ''}
    ]);
    

    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const fetchData = async () => {
        try {
            const res = await fetch(`${API_URL}/inventory`);
            const data = await res.json();

            console.log('use effect and fetch called');

            if (Array.isArray(data)) {
                setInventoryData(data);
            } else {
                console.error('Unexpected response format (not an array):', data);
                setInventoryData([]); // or handle accordingly
            }
        } catch (err) {
            console.error('Error fetching data from funerals:', err);
            setInventoryData([]); // optionally reset or show fallback
        }
    };
    
    useEffect( () => {
        fetchData();
    }, []);


    const handleOpenModal= (e) => {
        console.log('Open Modal Handle clicked!');
        e.preventDefault();
        setIsCreateInventoryModalVisible(!isCreateInventoryModalVisible);
    };

    const deleteItem = async(id) => {
        console.log('Deleting item with id : ', id);
        try {
            const response = await fetch(`${API_URL}/inventory/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type' : 'application/json',
                }
            });

            if (!response.ok) { throw new Error('Failed to generate Invoice')};
            
            const data = await response.json();
            console.log('response received = ', data);

        } catch (error) {
            console.error('Error:', error);
        }

        await fetchData();
        // setIsDrawerVisible(false);
        setIsCreateInventoryModalVisible(false);
    }
           
    return(

        <div id="pageContainer" className="flex flex-row p-5">

            {/* MainSidebar */}
            <MainSidebar />

            {/* MainContent */}
            <div id="mainContentContainer" className="bg-gray-200 flex-auto m-1 rounded-sm">
                {/* Top Section */}
                <div id="topSection" className="flex flex-row bg-gray-400 justify-between  m-1 rounded-sm">
                    <div className="my-2">
                        <h2>Inventory</h2>
                    </div>
                    
                    <button className="m-2 p-2 bold bg-gray-200 rounded-md hover:bg-gray-300" onClick={(e) => {handleOpenModal(e)}}>+ Add Item</button>
                </div>

                 {/* Table Section */}
                <div id="tableSection" className="bg-gray-300 my-2  m-1 rounded-sm">
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Item Name</th>
                                <th className="px-4 py-2 text-left">Inventory Category</th>
                                <th className="px-4 py-2 text-left">Item Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryData.length > 0 ?
                                (inventoryData.map( (item) => (
                                    <tr key={item._id} className="rounded-sm border-b border-white hover:shadow-sm">
                                        <td className="px-4 py-2 text-left">{item.name}</td>
                                        <td className="px-4 py-2 text-left">{item.category}</td>
                                        <td className="px-4 py-2 text-left">{item.type}</td>
                                        <td className="px-4 py-2 text-left">
                                            <button onClick={ () => {deleteItem(item._id)} }> 
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))) : (
                                    <tr>
                                        <td  colspan="3" className="p-5 text-center">
                                            <h2>Nothing in Inventory</h2>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>


            {/* CreateFuneralModal */}
            <CreateInventoryModal 
                isCreateInventoryModalVisible={isCreateInventoryModalVisible}
                setIsCreateInventoryModalVisible={setIsCreateInventoryModalVisible}
                rowItems={rowItems}
                setRowItems={setRowItems}
                fetchData={fetchData}
            />

        </div>

    )

}