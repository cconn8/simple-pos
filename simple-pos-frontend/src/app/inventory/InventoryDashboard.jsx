"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { SummaryDrawer } from "./SummaryDrawer";
import { RefreshCw } from "@deemlol/next-icons";
import MainSidebar from "../components/MainSidebar/MainSidebar";


export default function InventoryDashboard() {

    const [existingFuneralData, setExistingFuneralData] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [summaryItem, setSummaryItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [invoiceLoading, setInvoiceLoading] = useState(null);

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

    if (!existingFuneralData) return <p>Loading...</p>

    const handleOpenDrawer = (isDrawerVisible, data) => {
        setIsDrawerVisible(!isDrawerVisible);
        setSummaryItem(data);
        console.log('Handle Open Drawer clicked and Summary Item is set : ', data);
    };

    const handleOpenModal= (e) => {
        console.log('Open Modal Handle clicked!');
        e.preventDefault();
        setIsModalVisible(!isModalVisible);
    };
    const handleInvoiceLoading = (id) => {

    }
    async function handleDeleteFuneral(funeralId){
        console.log('Deleting funeral with id : ', funeralId);
        try {
            const response = await fetch(`http://localhost:3005/funerals/${funeralId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type' : 'application/json',
                }
            });

            if (!response.ok) { throw new Error('Failed to generate Invoice')};
            
            const data = await response.json();
            console.log('Invoice URL:', data.url);

        } catch (error) {
            console.error('Error:', error);
        }

        await fetchData();
        setIsDrawerVisible(false);
        setIsModalVisible(false);
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
                        <h2>Funerals</h2>
                    </div>
                    
                    <button className="m-2 p-2 bold bg-gray-200 rounded-md hover:bg-gray-300" onClick={(e) => {handleOpenModal(e)}}>+ Create</button>
                </div>

                 {/* Table Section */}
                <div id="tableSection" className="bg-gray-300 my-2  m-1 rounded-sm">
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Deceased Name</th>
                                <th className="px-4 py-2 text-left">Date of Death</th>
                                <th className="px-4 py-2 text-left">Invoice</th>
                            </tr>
                        </thead>

                        <tbody>
                            {existingFuneralData.map( (data) => (
                                <tr key={data._id} className="rounded-sm border-b border-white hover:shadow-sm">
                                    <td className="px-4 py-2 text-left ">{data.formData.deceasedName}</td>
                                    <td className="px-4 py-2 text-left">{data.formData.dateOfDeath}</td>
                                    <td className="px-4 py-2 text-left underline hover:font-bold">
                                        {invoiceLoading === data._id ? (
                                            <div id="loadingDiv">loading...</div>
                                        ) : data.formData.invoice ? (
                                            <div className="flex flex-row space-between">
                                                <Link
                                                    href={data.formData.invoice}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                    className="underline"
                                                >
                                                    {data.formData.deceasedName}-invoice
                                                </Link>
                                                <RefreshCw
                                                    className="px-2"
                                                    size={36}
                                                    color="black"
                                                    onClick={() => handleGenerateInvoice(data._id)}
                                                />
                                            </div>
                                        ) : (
                                            <button onClick={() => handleGenerateInvoice(data._id)}>
                                                Generate Invoice
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-left underline hover:font-bold">
                                        <button onClick={() => handleOpenDrawer(isDrawerVisible, data)}>View / Edit</button>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    )

}