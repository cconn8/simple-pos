"use client";

import { useFuneralsV2 } from "@/hooks/useFuneralsV2";
import { useInvoices } from "@/hooks/useApi";
import { useCallback, useEffect, useMemo, useState } from "react";
// import { useFunerals, useInvoices } from "@/hooks/useApi";
import {tableDisplayMappings} from "@/config/funeral-categories";
import { KeyDisplay } from "../../../../types";
import { ChevronDown, ChevronRight, ChevronUp } from "@deemlol/next-icons";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import { useFuneralsContext } from "@/contexts/FuneralsContext";
import { Trash2 } from "@deemlol/next-icons";
import FilterBar from './FilterBar';
import { formatDateDisplay } from "@/utils/dateUtils";
import { FuneralDataV2 } from "@/types/funeralV2";
import Link from "next/link";

// Color mapping for funeral types (same pattern as Delete/Reset buttons)
const getFuneralTypeStyles = (type: string): string => {
    switch (type) {
        case 'Funeral':
            return 'px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded';
        case 'Coroner':
            return 'px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded';
        case 'Pre-Arrangement':
            return 'px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded';
        case 'Sale':
            return 'px-2 py-1 text-xs bg-green-100 text-green-600 rounded';
        case 'Quotation':
            return 'px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded';
        default:
            return 'px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded'; // Fallback for legacy types
    }
};

interface CustomDataTableProps {
  funerals: any[];
  tableDisplayMappings?: KeyDisplay[];
  selectedCells?: string[];
}

interface FuneralTableProps {
    query? : string;
    currentPage? : string;
}


export default function FuneralTable(props : FuneralTableProps) {
    const { funerals, filteredFunerals, isLoading, error, fetchFunerals } = useFuneralsV2();
    console.log('📋 Loaded funerals count:', funerals?.length || 0);
    // const { funerals, filteredFunerals, isLoading, error, fetchFunerals, updateFuneral } = useFunerals();
    const { generateInvoice, error: invoiceError } = useInvoices();
    
    // Track loading state per funeral ID
    const [generatingInvoiceIds, setGeneratingInvoiceIds] = useState<Set<string>>(new Set());
    const {  
        showFuneralModal,  
        setShowFuneralModal, 
        setShowDeleteModal, 
        setDeleteTarget,
        setShowFuneralDetail,
        setViewingFuneral,
        sortField,
        sortDirection,
        handleSort,
        setShowXeroPostingModal,
        setXeroPostingFuneral,
        filters
    } = useFuneralsContext();

    // Process filtered funerals
    //selected cells to show in the funerals table
    const selectedCells = ['deceasedName', 'funeralType', 'dateOfDeath', 'fromDate', 'invoice', 'xeroStatus'] //fromDate is referenced as Commenced Work

    //organise data for table
    const normalizedFuneralData = useMemo(() => {
        let processedData = filteredFunerals
            .filter(funeral => funeral.funeralData) // Remove funerals without funeralData
            .filter(funeral => {
                // Apply comprehensive filters
                const funeralData = funeral.funeralData;
                
                // Type filter
                if (filters.type && funeralData.funeralType !== filters.type) {
                    return false;
                }
                
                // Date of Death filters
                if (filters.dateOfDeathYear || filters.dateOfDeathMonth) {
                    if (!funeralData.dateOfDeath) return false; // No date = no match
                    const deathDate = new Date(funeralData.dateOfDeath);
                    
                    if (filters.dateOfDeathYear) {
                        const deathYear = deathDate.getFullYear().toString();
                        if (deathYear !== filters.dateOfDeathYear) return false;
                    }
                    
                    if (filters.dateOfDeathMonth) {
                        const deathMonth = deathDate.toLocaleString('default', { month: 'long' });
                        if (deathMonth !== filters.dateOfDeathMonth) return false;
                    }
                }
                
                // Commenced Work filters
                if (filters.commencedWorkYear || filters.commencedWorkMonth) {
                    if (!funeralData.fromDate) return false; // No date = no match
                    const workDate = new Date(funeralData.fromDate);
                    
                    if (filters.commencedWorkYear) {
                        const workYear = workDate.getFullYear().toString();
                        if (workYear !== filters.commencedWorkYear) return false;
                    }
                    
                    if (filters.commencedWorkMonth) {
                        const workMonth = workDate.toLocaleString('default', { month: 'long' });
                        if (workMonth !== filters.commencedWorkMonth) return false;
                    }
                }
                
                return true;
            })
            .map((funeral) => ({
                ...funeral,
                // Flatten V2 data structure for table display so the keys are nested for easy search
                deceasedName: funeral.funeralData.deceasedName,
                funeralType: funeral.funeralData.funeralType || 'Funeral', // Default for legacy records
                dateOfDeath: funeral.funeralData.dateOfDeath,
                fromDate: funeral.funeralData.fromDate,
                clientName: funeral.funeralData.client.name,
                clientAddress: funeral.funeralData.client.address,
                clientPhone: funeral.funeralData.client.phone,
                lastAddress: funeral.funeralData.lastAddress,
                invoice: funeral.funeralData.invoice.pdfUrl  ||  "",  // Invoice URL at top level
                xeroStatus: funeral.xeroData?.status || null,  // XERO posting status
                paymentStatus: funeral.paymentStatus || 'Unpaid',  // Include payment status for controls
                // paymentStatus removed for redesign
            }));

        // Apply sorting if sortField and sortDirection are set
        if (sortField && sortDirection) {
            processedData = processedData.sort((a, b) => {
                // Access flattened data directly (after our normalization above)
                let aValue: any = (a as any)[sortField] || '';
                let bValue: any = (b as any)[sortField] || '';

                // Special handling for date fields (dateOfDeath, fromDate)
                if (sortField === 'dateOfDeath' || sortField === 'fromDate') {
                    const aTime = new Date(aValue as string).getTime();
                    const bTime = new Date(bValue as string).getTime();
                    
                    if (sortDirection === 'asc') {
                        return aTime - bTime;
                    } else {
                        return bTime - aTime;
                    }
                }

                // Convert to strings for comparison
                const aString = String(aValue).toLowerCase();
                const bString = String(bValue).toLowerCase();

                if (sortDirection === 'asc') {
                    return aString < bString ? -1 : aString > bString ? 1 : 0;
                } else {
                    return aString > bString ? -1 : aString < bString ? 1 : 0;
                }
            });
        }
        // Funerals processed for display
        return processedData;
    }, [filteredFunerals, sortField, sortDirection, filters]);

    // const funeralFormData = filteredFunerals.map((funeral) => funeral.formData ?? null).filter((fd): fd is FuneralFormData => fd !== null);
    const headingsToShow = tableDisplayMappings.filter((mapping) => selectedCells.includes(mapping.key));
    const headingsToShowKeys = headingsToShow.map((c) => c.key);
    const headingsToShowDisplayText = headingsToShow.map((c) => c.displayText);

    useEffect(() => {
        // Fetch funerals on mount
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

    // Payment status update handler
    const handlePaymentStatusChange = async (funeralId: string, newStatus: string) => {
        try {
            // Use the existing API to update payment status
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funerals/${funeralId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth token if available
                    ...(localStorage.getItem('auth_token') && { 
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}` 
                    })
                },
                body: JSON.stringify({ paymentStatus: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update payment status');
            
            // Refresh funeral data to see changes
            await fetchFunerals();
        } catch (error) {
            console.error('Error updating payment status:', error);
            alert('Failed to update payment status. Please try again.');
        }
    };

    // XERO posting handler
    const handlePostToXero = (funeral: any) => {
        // Find the V2 version of the funeral for the modal
        const funeralV2 = funerals.find(f => f._id === funeral._id);
        if (funeralV2) {
            setXeroPostingFuneral(funeralV2);
            setShowXeroPostingModal(true);
        }
    };

    // Helper function to render sort icon
    const renderSortIcon = (field: string) => {
        if (sortField !== field) {
            return <ChevronDown size={16} className="text-gray-400" />;
        }
        
        if (sortDirection === 'asc') {
            return <ChevronUp size={16} className="text-blue-600" />;
        } else if (sortDirection === 'desc') {
            return <ChevronDown size={16} className="text-blue-600" />;
        }
        
        return <ChevronDown size={16} className="text-gray-400" />;
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
        // Set this funeral as loading
        setGeneratingInvoiceIds(prev => new Set(prev).add(funeralId));
        
        try {
            await generateInvoice(funeralId);
            // Optionally refresh funerals to get updated invoice URL
            await fetchFunerals();
        } catch (error) {
            console.error('Failed to generate invoice:', error);
            // You could show a toast notification here
        } finally {
            // Remove this funeral from loading state
            setGeneratingInvoiceIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(funeralId);
                return newSet;
            });
        }
    };

    // Delete invoice handler
    const handleDeleteInvoice = async (funeralId: string, invoiceUrl: string) => {
        if (!confirm('Delete this invoice? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoice/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(localStorage.getItem('auth_token') && { 
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}` 
                    })
                },
                body: JSON.stringify({ funeralId, invoiceUrl })
            });

            if (!response.ok) throw new Error('Failed to delete invoice');
            
            alert('✅ Invoice deleted successfully!');
            // Refresh funeral data to see changes
            await fetchFunerals();
        } catch (error) {
            console.error('Error deleting invoice:', error);
            alert('❌ Failed to delete invoice. Please try again.');
        }
    };

    // Render the actual table
    //funerals is an array of funeralObjects
    return (
        <div className="bg-white m-1 rounded-sm p-4 w-full">
            <div className="flex gap-x-3 mb-2">
                <h2 className="text-xl font-bold align-middle">Funerals ({normalizedFuneralData.length})</h2>  
                <SearchBar placeholder="Search funerals" />
            </div>
            
            {/* Comprehensive Filter Bar */}
            <FilterBar />
                

            <div className="overflow-x-auto">
                <table className="table-auto w-full border border-gray-200 text-left">
                    <thead className="bg-gray-50">
                    <tr>
                
                        {headingsToShow.map((heading, index) => (
                        <th key={index} className="px-4 py-2 font-semibold border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <span>{heading.displayText}</span>
                                <button 
                                    onClick={() => handleSort(heading.key)} 
                                    className="ml-2 hover:bg-gray-100 p-1 rounded transition-colors"
                                    title={`Sort by ${heading.displayText}`}
                                >
                                    {renderSortIcon(heading.key)}
                                </button>
                            </div>
                        </th>
                        ))}
                        <th id="action-heading" className="px-4 py-2 font-semibold border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <span>Actions</span>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                        {normalizedFuneralData.map((normFuneralObject, index) => {
                            // No need to merge formData - we already flattened the data in normalization
                            // const mergedFuneralObj = funeralObject;

                            // Fix: Iterate through columns in exact header order instead of object property order
                            const cellsToShow = headingsToShowKeys.map(key => [key, (normFuneralObject as any)[key]]);
                            return (
                                <tr 
                                    key={index} 
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleViewClick(normFuneralObject)}
                                >
                                    {cellsToShow.map(([key, val], i) => (
                                        <td key={i} className="px-4 py-2 border-b border-gray-100 whitespace-nowrap">
                                            {key === "funeralType" ? (
                                                <span className={getFuneralTypeStyles(val || 'Funeral')}>
                                                    {val || 'Funeral'}
                                                </span>
                                            ) : key === "invoice" && typeof val === "string" ? (
                                                val.length > 1 ? (
                                                    <div className="flex items-center gap-2">
                                                        <a href={val} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-blue-600 underline"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            View Invoice
                                                        </a>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteInvoice(normFuneralObject._id, val);
                                                            }}
                                                            className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                            title="Delete invoice"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                ) : <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleGenerateInvoice(normFuneralObject._id);
                                                    }} 
                                                    disabled={generatingInvoiceIds.has(normFuneralObject._id)} 
                                                    className={`bg-blue-500 text-xsmall p-1 rounded border text-white hover:bg-blue-700 ${generatingInvoiceIds.has(normFuneralObject._id) ? "opacity-50 cursor-not-allowed" : ""}`}
                                                >
                                                    {generatingInvoiceIds.has(normFuneralObject._id) ? "Generating..." : "Generate Invoice"}
                                                </button>
                                            ) : key === "xeroStatus" ? (
                                                // Render XERO status with appropriate styling
                                                val === 'posted' ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                            <a href="https://go.xero.com/AccountsReceivable/Search.aspx?invoiceStatus=INVOICESTATUS/AUTHORISED"
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="underline"
                                                            onClick={(e) => e.stopPropagation()}
                                                            >
                                                                ✅ Posted to XERO
                                                            
                                                            </a>
                                                        </span>
                                                        <button
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                if (confirm('Reset XERO data? This will allow you to post to XERO again.')) {
                                                                    try {
                                                                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funerals/${normFuneralObject._id}/xero/reset`, {
                                                                            method: 'DELETE'
                                                                        });
                                                                        const result = await response.json();
                                                                        if (result.success) {
                                                                            alert('✅ XERO data reset successfully!');
                                                                            window.location.reload(); // Simple refresh
                                                                        } else {
                                                                            alert('❌ Failed to reset XERO data');
                                                                        }
                                                                    } catch (error) {
                                                                        alert('❌ Error resetting XERO data');
                                                                    }
                                                                }
                                                            }}
                                                            className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                            title="Reset XERO posting status"
                                                        >
                                                            Reset
                                                        </button>
                                                    </div>
                                                ) : val === 'posting' ? (
                                                    <span className="flex items-center gap-1 text-blue-600 text-sm">
                                                        🔄 Posting...
                                                    </span>
                                                ) : val === 'failed' ? (
                                                    <span className="flex items-center gap-1 text-red-600 text-sm" title={normFuneralObject.xeroData?.errorMessage || 'Posting failed'}>
                                                        ❌ Failed
                                                    </span>
                                                ) : (normFuneralObject.paymentStatus === 'Paid' || normFuneralObject.paymentStatus === 'Partially Paid') ? (
                                                    // Show "Post to XERO" button for paid funerals not yet posted
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePostToXero(normFuneralObject);
                                                        }}
                                                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                                        title="Post invoice to XERO"
                                                    >
                                                        📤 Post
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )
                                            ) : key === "fromDate" ? (
                                                <span>{formatDateDisplay(val as string)}</span>
                                            ) : key === "dateOfDeath" ? (
                                                <span>{formatDateDisplay(val as string)}</span>
                                            ) : (
                                                <span>{String(val)}</span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2 border-b border-gray-100 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {/* Payment Status Dropdown */}
                                            <select
                                                value={normFuneralObject.paymentStatus}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handlePaymentStatusChange(normFuneralObject._id, e.target.value);
                                                }}
                                                className={`text-xs px-2 py-1 rounded border ${
                                                    normFuneralObject.paymentStatus === 'Paid' 
                                                        ? 'bg-green-100 text-green-800 border-green-300'
                                                    : normFuneralObject.paymentStatus === 'Partially Paid'
                                                        ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                                    : 'bg-gray-100 text-gray-800 border-gray-300'
                                                }`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <option value="Unpaid">Unpaid</option>
                                                <option value="Partially Paid">Partially Paid</option>
                                                <option value="Paid">Paid</option>
                                            </select>
                                            
                                            {/* Delete Button */}
                                            <Trash2 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(normFuneralObject._id, normFuneralObject.deceasedName || 'Unknown');
                                                }} 
                                                size={20} 
                                                color="#ff5c5cff" 
                                                className="cursor-pointer hover:opacity-70"
                                            />
                                        </div>
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