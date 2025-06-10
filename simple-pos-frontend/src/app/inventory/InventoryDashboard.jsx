"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import MainSidebar from "../components/MainSidebar/MainSidebar";
import { CreateInventoryModal } from "./CreateInventoryModal";


export default function InventoryDashboard() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [existingFuneralData, setExistingFuneralData] = useState([]);

    const router = useRouter();

    const fetchData = async() => {
        try{
            fetch('http://localhost:3005/funerals')
            .then(res => res.json())
            .then(data => setExistingFuneralData(data))
            .catch(err => console.error('Error fetching data from funerals : ', err));
            console.log('use effect and fetched called');
        }
        catch (err) {
            console.error('Error fetching data from funerals : ', err);
        }
    }
    
    useEffect( () => {
        fetchData();
    }, []);


    const handleOpenModal= (e) => {
        console.log('Open Modal Handle clicked!');
        e.preventDefault();
        setIsModalVisible(!isModalVisible);
    };
           
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
                </div>
            </div>


            {/* CreateFuneralModal */}
            <CreateInventoryModal 
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
            />

        </div>

    )

}