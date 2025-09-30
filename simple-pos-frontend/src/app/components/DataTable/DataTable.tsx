
import { FuneralData, FuneralFormData } from "@/types";
import { ChevronDown } from "@deemlol/next-icons";

type TableProps = {
    headings? : string[],
    data? : string[][],
}

type FlexibleRowProps = {
    funeralObject : FuneralData,
    selectedCells? : string[]
}


export function Cell({children, isHeader} : {children: React.ReactNode, isHeader: boolean}) {
    return(
        <div className={`px-4 py-2 ${isHeader ? "font-semibold flex items-center justify-between border-1 border-gray-100 bg-gray-50" : "border-1 border-gray-50"}`}>
            {children}
        </div>
    )
}

export function HeaderRow({headings} : TableProps) {
    return(
        <div id="headings-row" className="grid grid-cols-4">
            {headings?.map( (heading, i) => (
                <Cell key={i} isHeader={true}>
                    <span>{heading}</span>
                    <button onClick={() => alert(`${heading} button clicked!`)}>
                        <ChevronDown size="16" className="text-gray-600 hover:text-red-500" />
                    </button>
                </Cell>
             ))}
        </div>
    )

}

export function Row({row} : {row: string[]} ) {
    return(
        <div id="table-row" className="grid grid-cols-4 border-1/2 border-gray-50 hover:bg-gray-50">
            {row?.map((cell, i) => (
                <Cell key={i} isHeader={false}>
                    <span>{cell}</span>
                </Cell>
            ))}
        </div>
    )
}

export function FlexibleFuneralRow({ funeralObject, selectedCells }: FlexibleRowProps) {
  const { formData } = funeralObject;
  const allEntries = Object.entries(formData); //[[key,val][key,val]]

  // If selectedCells is provided, use only those fields
  // Otherwise, use all available fields
  const keysToDisplay = selectedCells || Object.keys(formData);

  //const displayCells = allEntries.map((item) => )


  return (
    <div 
      id="table-row" 
      className={`grid grid-cols-${cellData.length} gap-2 border border-gray-200 hover:bg-gray-50 transition-colors`}
    >
      {cellData.map((cell, index) => (
        <Cell key={`${funeralObject._id}-${cell.key}-${index}`} isHeader={false}>
          <span>{cell.value}</span>
        </Cell>
      ))}
    </div>
  );
}


export default function DataTable({headings, data} : TableProps) {

// reusable datatable component
    return 
}