import { useEffect } from "react";
import { useFunerals } from "@/hooks/useApi";
import { useFuneralModal } from "@/contexts/FuneralModalContext";
import {tableDisplayMappings} from "@/config/funeral-categories";
import CustomDataTable from "@/app/components/DataTable/CustomDataTable";
import { FuneralFormData, KeyDisplay } from "../../../../types";
import { ChevronDown } from "@deemlol/next-icons";

interface CustomDataTableProps {
  funerals: any[];
  tableDisplayMappings?: KeyDisplay[];
  selectedCells?: string[];
}



export default function FuneralTable() {
    const { funerals, isLoading, error, fetchFunerals } = useFunerals();
    const {openCreateFuneral} = useFuneralModal();

    useEffect(() => {
        console.log('🚀 useEffect triggered - calling fetchFunerals');
        fetchFunerals();
    }, [fetchFunerals]);

    // Debugging
    console.log('🔍 Debug Info:');
    console.log('  - isLoading:', isLoading);
    console.log('  - error:', error);
    console.log('  - funerals:', funerals);
    console.log('  - funerals type:', typeof funerals);
    console.log('  - funerals length:', Array.isArray(funerals) ? funerals.length : 'Not an array');

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
                        onClick={openCreateFuneral}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Create First Funeral
                    </button>
                </div>
            </div>
        );
    }

    const selectedCells = ['deceasedName', 'dateOfDeath', 'invoice']

    //organise data for table
    const funeralFormData = funerals
        .map((funeral) => funeral.formData ?? null)
        .filter((fd): fd is FuneralFormData => fd !== null);
    
    const headingsToShow = tableDisplayMappings.filter((mapping) => selectedCells.includes(mapping.key));
    const headingsToShowKeys = headingsToShow.map((c) => c.key);
    const headingsToShowDisplayText = headingsToShow.map((c) => c.displayText);

    // Render the actual table
    //funerals is an array of funeralObjects
    return (
        <div className="bg-white m-1 rounded-sm p-4 w-full">
            <h2 className="text-xl font-bold mb-4">Funerals ({funerals.length})</h2>        

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
                    </tr>
                    </thead>
                    <tbody>
                    {funeralFormData.map((funeralObject, i) => {
                        const cellsToShow = Object.entries(funeralObject).filter(([key]) =>
                        headingsToShowKeys.includes(key)
                        );
                        return (
                        <tr key={i} className="hover:bg-gray-50">
                            {cellsToShow.map(([key, val], j) => (
                            <td key={j} className="px-4 py-2 border-b border-gray-100 whitespace-nowrap">
                                {key === "invoice" && typeof val === "string" ? (
                                <a
                                    href={val}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    View Invoice
                                </a>
                                ) : (
                                <span>{String(val)}</span>
                                )}
                            </td>
                            ))}
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}