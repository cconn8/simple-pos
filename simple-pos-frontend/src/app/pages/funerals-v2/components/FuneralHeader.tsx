"use client";

interface FuneralHeaderProps {
    openCreateFuneral:  (e: React.MouseEvent) => void;
}

export default function FuneralHeader({openCreateFuneral} : FuneralHeaderProps) {
    return(
        <div className="flex flex-row p-2 w-full h-20 bg-gray-50 rounded-sm items-center justify-between border border-gray-200">
            <h1 className="font-bold">Funerals</h1>
            <button 
                onClick={openCreateFuneral}
                className="p-2 border-1 border-gray-300 rounded-sm bg-blue-600 text-white hover:bg-blue-700">+ Create Funeral</button>
        </div>
        
    )
}