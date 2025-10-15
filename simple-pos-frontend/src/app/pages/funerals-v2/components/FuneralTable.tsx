"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFunerals, useInvoices } from "@/hooks/useApi";
import {tableDisplayMappings} from "@/config/funeral-categories";
import { KeyDisplay } from "../../../../types";
import { ChevronDown, ChevronRight } from "@deemlol/next-icons";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import { useFuneralsContext } from "@/contexts/FuneralsContext";
import { Trash2 } from "@deemlol/next-icons";

interface CustomDataTableProps {
  funerals: any[];
  tableDisplayMappings?: KeyDisplay[];
  selectedCells?: string[];
}

interface FuneralTableProps {
    query? : string;
    currentPage? : string;
}

function formatDate(date : string) {
    const d = date.split('-');
    return new Date(date).toLocaleDateString();
}

export default function FuneralTable(props : FuneralTableProps) {
    const { funerals, filteredFunerals, isLoading, error, fetchFunerals } = useFunerals();
    const { generateInvoice, isLoading: isGeneratingInvoice, error: invoiceError } = useInvoices();
    const {  
        showFuneralModal,  
        setShowFuneralModal, 
        setShowDeleteModal, 
        setDeleteTarget,
        setShowFuneralDetail,
        setViewingFuneral
    } = useFuneralsContext();

    
    //selected cells to show in the funerals table
    const selectedCells = ['deceasedName', 'dateOfDeath', 'invoice']

    //organise data for table
    const normalizedFuneralData = useMemo(() => {
        return filteredFunerals
            .filter(funeral => funeral.formData) // Remove funerals without formData
            .map((funeral) => ({
                ...funeral,
                formData : {
                    ...funeral.formData!,
                    invoice : funeral.formData!.invoice ?? ""
                },
            }));
    }, [filteredFunerals]);

    // const funeralFormData = filteredFunerals.map((funeral) => funeral.formData ?? null).filter((fd): fd is FuneralFormData => fd !== null);
    const headingsToShow = tableDisplayMappings.filter((mapping) => selectedCells.includes(mapping.key));
    const headingsToShowKeys = headingsToShow.map((c) => c.key);
    const headingsToShowDisplayText = headingsToShow.map((c) => c.displayText);

    useEffect(() => {
        console.log('🚀 useEffect triggered on fetchFunerals- calling fetchFunerals');
        fetchFunerals();
    }, [fetchFunerals]);

    // Delete handler
    const handleDeleteClick = (funeralId: string, funeralName: string) => {
        setDeleteTarget({ id: funeralId, name: funeralName });
        setShowDeleteModal(true);
    };

    // View handler
    const handleViewClick = (funeral: any) => {
        setViewingFuneral(funeral);
        setShowFuneralDetail(true);
    };

    if (error) {
        return (
            <div className="bg-gray-200 flex-auto m-1 rounded-sm p-4">
                <div className="text-center text-red-600">
                    <h2>Error loading funerals</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-gray-200 flex-auto m-1 rounded-sm p-4">
                <div className="text-center">
                    <p>Loading funerals...</p>
                </div>
            </div>
        );
    }
    // Check what we actually have
    if (!funerals) {
        return (
            <div className="bg-gray-200 flex-auto m-1 rounded-sm p-4">
                <div className="text-center text-yellow-600">
                    <h2>No funerals data</h2>
                    <p>funerals is: {String(funerals)}</p>
                    <button 
                        onClick={fetchFunerals}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!Array.isArray(funerals)) {
        return (
            <div className="bg-gray-200 flex-auto m-1 rounded-sm p-4">
                <div className="text-center text-yellow-600">
                    <h2>Invalid funerals data</h2>
                    <p>Expected array, got: {typeof funerals}</p>
                    <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">
                        {JSON.stringify(funerals, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }

    if (funerals.length === 0) {
        return (
            <div className="bg-gray-200 flex-auto m-1 rounded-sm p-4">
                <div className="text-center">
                    <h2>No funerals found</h2>
                    <p>Click the button below to create your first funeral record.</p>
                    <button 
                        onClick={() => {setShowFuneralModal(!showFuneralModal)}}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Create First Funeral
                    </button>
                </div>
            </div>
        );
    }

    const handleGenerateInvoice = async (funeralId: string) => {
        try {
            await generateInvoice(funeralId);
            // Optionally refresh funerals to get updated invoice URL
            await fetchFunerals();
        } catch (error) {
            console.error('Failed to generate invoice:', error);
            // You could show a toast notification here
        }
    };

    // Render the actual table
    //funerals is an array of funeralObjects
    return (
        <div className="bg-white m-1 rounded-sm p-4 w-full">
            <div className="flex gap-x-3 mb-2">
                <h2 className="text-xl font-bold align-middle">Funerals ({filteredFunerals.length})</h2>  
                <SearchBar placeholder="Search funerals" />
            </div>    

            <div className="overflow-x-auto">
                <table className="table-auto w-full border border-gray-200 text-left">
                    <thead className="bg-gray-50">
                    <tr>
                
                        {headingsToShowDisplayText.map((heading, index) => (
                        <th key={index} className="px-4 py-2 font-semibold border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <span>{heading}</span>
                                <button onClick={() => alert(`${heading} button clicked!`)} className="ml-2"
                                >
                                    <ChevronDown
                                        size={16}
                                        className="text-gray-600 hover:text-red-500"
                                    />
                                </button>
                            </div>
                        </th>
                        ))}
                        <th id="action-heading" className="px-4 py-2 font-semibold border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <span>Actions</span>
                            </div>
                        </th>
                        <th className="px-4 py-2 font-semibold border-b border-gray-200 w-12">
                            <span>View</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                        {normalizedFuneralData.map((funeralObject, index) => {
                            const mergedFuneralObj = {
                                ...funeralObject,
                                ...(funeralObject.formData ?? {})
                            };
                            delete (mergedFuneralObj as any).formData;

                            const cellsToShow = Object.entries(mergedFuneralObj).filter(([key]) => headingsToShowKeys.includes(key));
                            return (
                                <tr key={index} className="hover:bg-gray-50">
                                    {cellsToShow.map(([key, val], i) => (
                                        <td key={i} className="px-4 py-2 border-b border-gray-100 whitespace-nowrap">
                                            {key === "invoice" && typeof val === "string" ? (
                                                val.length > 1 ? (
                                                        <a href={val} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-blue-600 underline"
                                                        >
                                                            View Invoice
                                                        </a> 
                                                ) : <button onClick={() => handleGenerateInvoice(mergedFuneralObj._id)} disabled={isGeneratingInvoice} className={`bg-blue-500 text-xsmall p-1 rounded border text-white hover:bg-blue-700 ${isGeneratingInvoice ? "opacity-50 cursor-not-allowed" : ""}`}>
                                                    {isGeneratingInvoice ? "Generating..." : "Generate Invoice"}</button>
                                            ) : (
                                                <span>{String(val)}</span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2 border-b border-gray-100 whitespace-nowrap">
                                        <Trash2 
                                            onClick={() => handleDeleteClick(funeralObject._id, funeralObject.formData?.deceasedName || 'Unknown')} 
                                            size={24} 
                                            color="#ff5c5cff" 
                                            className="cursor-pointer hover:opacity-70"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-100 whitespace-nowrap">
                                        <button 
                                            onClick={() => handleViewClick(funeralObject)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                            title="View funeral details"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        
    )
}