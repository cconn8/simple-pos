"use client"    

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MainSidebar from "../components/MainSidebar/MainSidebar";
import { SummaryDrawer } from "./SummaryDrawer";
import { CreateFuneralModal } from "./CreateFuneralModal";
import { UpdateFuneralModal } from "./UpdateFuneralModal";
import Link from "next/link";
import { RefreshCw } from "@deemlol/next-icons";
import { EditInvoiceModal } from "./EditInvoiceModal";
import DeleteModal from "../components/DeleteModal";
import { v4 as uuidv4 } from 'uuid';

export default function Dashboard() {

    const [existingFuneralData, setExistingFuneralData] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isCreateFuneralModalVisible, setIsCreateFuneralModalVisible] = useState(false);
    const [isCreateInventoryModalVisible, setIsCreateInventoryModalVisible] = useState(false);
    const [summaryItem, setSummaryItem] = useState(null);
    const [formData, setFormData] = useState({});  //this is the funeral data that is sent to the server when creating a funeral
    const [invoiceLoading, setInvoiceLoading] = useState(null); 
    const [isEditInvoiceModalVisible, setIsEditInvoiceModalVisible] = useState(false);
    const [editInvoiceData, setEditInvoiceData] = useState({"misterMisses" : ''});
    const [currentFuneralId, setCurrentFuneralId] = useState('');
    const [currentDeceasedName, setCurrentDeceasedName] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentInvoiceUrl, setCurrentInvoiceUrl] = useState('');
    const [temporaryAddedItem, setTemporaryAddedItem] = useState([]);
    const [rowItems, setRowItems] = useState([  //this is the initial row state for adding new items to inventory form
        {_id: uuidv4(), name: '' , category : '', type : '', description : '', qty : 1, isBillable : '', price : ''}
    ]);
    const [editFuneralData, setEditFuneralData] = useState([]) // this us the temp funeral object for updating a funeral
    const [isUpdateFuneralModalVisible, setIsUpdateFuneralModalVisible] = useState(false);

    const resetState = async() => {
            setIsDrawerVisible(false);
            setIsCreateFuneralModalVisible(false);
            setIsCreateInventoryModalVisible(false);
            setSummaryItem(null);
            setFormData({});  //this is the funeral data that is sent to the server when creating a funeral
            setInvoiceLoading(null); 
            setIsEditInvoiceModalVisible(false);
            setEditInvoiceData({"misterMisses" : ''});
            setCurrentFuneralId('');
            setCurrentDeceasedName('');
            setIsDeleteModalVisible(false);
            setCurrentInvoiceUrl('');
            setTemporaryAddedItem([]);
            setRowItems([{_id: uuidv4(), name: '' , category : '', type : '', description : '', qty : 1, isBillable : '', price : 0}]);
            setIsUpdateFuneralModalVisible(false);
    }    

    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;   
    
    const fetchData = async () => {
        try {
            const res = await fetch(`${API_URL}/funerals`);
            console.log(`fetchData() fetching from ${API_URL}/funerals`);
            const data = await res.json();

            if (Array.isArray(data)) {
                    // console.log('Exisitng data contains form data : ', data)
                    setExistingFuneralData(data) ;
                } else {
                console.error('Funerals Array empty : ', data);
                setExistingFuneralData([]); // or handle accordingly
            }
        } catch (err) {
            console.error('Error fetching data from funerals:', err);
            setExistingFuneralData([]); // optionally reset or show fallback
        }
    };
    
    useEffect( () => {
        fetchData();
    }, []);

    if (!existingFuneralData) return <p>Loading...</p>

    const handleOpenDrawer = (isDrawerVisible, data) => {
        // console.log('Drawer data is : ' , data);
        setIsDrawerVisible(!isDrawerVisible);
        setSummaryItem(data);
        // console.log('Handle Open Drawer clicked and Summary Item is set : ', data);
    };
    const handleGenerateInvoice = async (funeralId, deceasedName) => {
        console.log('generate invoice handle clicked - Edit invoice?')
        setIsEditInvoiceModalVisible(true);
        setCurrentFuneralId(funeralId);
        setCurrentDeceasedName(deceasedName);
        console.log('calling edit invoice modal... data passed is :', funeralId, deceasedName)
        setIsEditInvoiceModalVisible(true); //make final ammendments dates etc. before submitting invoice
    }
    const handleOpenFuneralModal= (e) => {
        // console.log('Open Modal Handle clicked!');
        e.preventDefault();
        setIsCreateFuneralModalVisible(!isCreateFuneralModalVisible);
    };
    
    const handleOpenDeleteFuneralModal = (funeralId, deceasedName, invoiceUrl) => {
        console.log('Handle Delete Funeral Modal called with : ', funeralId, deceasedName)
        setCurrentFuneralId(funeralId);
        setCurrentDeceasedName(deceasedName);
        setCurrentInvoiceUrl(invoiceUrl)
        setIsDeleteModalVisible(true);
    };

    const openUpdateFuneralModal = async(funeralData) => {
        console.log('update funeral clicked, funeral data is : ', funeralData.formData);
        setCurrentFuneralId(funeralData._id);
        setFormData(funeralData.formData);

        // Small delay OR modal render conditioned on formData
        setTimeout(() => {
        setIsUpdateFuneralModalVisible(true);
        }, 100);
    };

    console.log('Existing funeral data received on the dashboard is : ', existingFuneralData);
       
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
                    
                    <button className="m-2 p-2 bold bg-gray-200 rounded-md hover:bg-gray-300" onClick={(e) => {handleOpenFuneralModal(e)}}>+ Create</button>
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
                            {existingFuneralData.length > 0 ?
                                existingFuneralData.map( (data) => (
                                data.formData &&
                                    <tr key={data._id} className="rounded-sm border-b border-white hover:shadow-sm">
                                        <td className="px-4 py-2 text-left ">{data.formData.deceasedName}</td>
                                        <td className="px-4 py-2 text-left">{new Date(data.formData.dateOfDeath).toLocaleDateString('en-GB')}</td>
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
                                                        onClick={() => handleGenerateInvoice(data._id, data.formData.deceasedName)}
                                                    />
                                                </div>
                                            ) : (
                                                <button className="bg-gray-500 text-white hover:bg-gray-600 p-2 rounded-md" onClick={() => handleGenerateInvoice(data._id, data.formData.deceasedName)}>
                                                    Generate Invoice
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-left underline hover:font-bold">
                                            <button className="underline" onClick={() => openUpdateFuneralModal(data)}>Edit Details</button>
                                        </td>
                                        <td className="px-4 py-2 text-left underline hover:font-bold">
                                            <button onClick={() => handleOpenDeleteFuneralModal(data._id, data.formData.deceasedName, data.formData.invoice)}>Delete</button>
                                        </td>
                                    </tr>
                                )) : 
                                <tr>
                                    <td><div className="text-center">No Funerals!</div></td>
                                    
                                </tr>
                            } 
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Drawer Section */}
            <SummaryDrawer 
                isDrawerVisible={isDrawerVisible}
                setIsDrawerVisible={setIsDrawerVisible}
                summaryItem={summaryItem}
                setIsUpdateFuneralModalVisible={setIsUpdateFuneralModalVisible}
                setEditFuneralData={setEditFuneralData}
                resetState={resetState}
            />

            {/* CreateFuneralModal */}
            <CreateFuneralModal 
                formData={formData}
                setFormData={setFormData}
                isCreateFuneralModalVisible={isCreateFuneralModalVisible}
                setIsCreateFuneralModalVisible={setIsCreateFuneralModalVisible}
                fetchData={fetchData}
                isCreateInventoryModalVisible={isCreateInventoryModalVisible}
                setIsCreateInventoryModalVisible={setIsCreateInventoryModalVisible}
                rowItems={rowItems}
                setRowItems={setRowItems}
                temporaryAddedItem={temporaryAddedItem}
                setTemporaryAddedItem={setTemporaryAddedItem}
                resetState={resetState}
            />


            {/* Edit Invoice Modal  */}
            <EditInvoiceModal 
                isEditInvoiceModalVisible={isEditInvoiceModalVisible}
                setIsEditInvoiceModalVisible={setIsEditInvoiceModalVisible}
                editInvoiceData={editInvoiceData}
                setEditInvoiceData={setEditInvoiceData}
                setInvoiceLoading={setInvoiceLoading}
                funeralId={currentFuneralId}
                deceasedName={currentDeceasedName}
                fetchData={fetchData}
                setIsDrawerVisible={setIsDrawerVisible}
                resetState={resetState}
            />

            <DeleteModal
                isDeleteModalVisible={isDeleteModalVisible}
                setIsDeleteModalVisible={setIsDeleteModalVisible} 
                currentDeceasedName={currentDeceasedName}
                setCurrentDeceasedName={setCurrentDeceasedName}
                currentFuneralId={currentFuneralId}
                setCurrentFuneralId={setCurrentFuneralId}
                currentInvoiceUrl={currentInvoiceUrl}
                setCurrentInvoiceUrl={setCurrentInvoiceUrl}
                fetchData={fetchData}
                resetState={resetState}
            />
 
            <UpdateFuneralModal
                formData={formData}
                setFormData={setFormData}
                isUpdateFuneralModalVisible={isUpdateFuneralModalVisible}
                setIsUpdateFuneralModalVisible={setIsUpdateFuneralModalVisible}
                fetchData={fetchData}
                isCreateInventoryModalVisible={isCreateInventoryModalVisible}
                setIsCreateInventoryModalVisible={setIsCreateInventoryModalVisible}
                rowItems={rowItems}
                setRowItems={setRowItems}
                temporaryAddedItem={temporaryAddedItem}
                setTemporaryAddedItem={setTemporaryAddedItem}
                currentFuneralId={currentFuneralId}
                setCurrentFuneralId={setCurrentFuneralId}
                resetState={resetState}
            />
        </div>

    )

}