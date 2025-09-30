import React from "react";
import { FuneralFormData, KeyDisplay } from "../../../types";
import { ChevronDown } from "@deemlol/next-icons";

interface CustomDataTableProps {
  funerals: any[];
  tableDisplayMappings?: KeyDisplay[];
  selectedCells?: string[];
}

export default function CustomDataTable({
  funerals,
  tableDisplayMappings = [],
  selectedCells = [],
}: CustomDataTableProps) {
  const funeralFormData = funerals
    .map((funeral) => funeral.formData ?? null)
    .filter((fd): fd is FuneralFormData => fd !== null);

  const headingsToShow = tableDisplayMappings.filter((mapping) =>
    selectedCells.includes(mapping.key)
  );

  const headingsToShowKeys = headingsToShow.map((c) => c.key);
  const headingsToShowDisplayText = headingsToShow.map((c) => c.displayText);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border border-gray-200 text-left">
        <thead className="bg-gray-50">
          <tr>
            {headingsToShowDisplayText.map((heading, index) => (
              <th
                key={index}
                className="px-4 py-2 font-semibold border-b border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <span>{heading}</span>
                  <button
                    onClick={() => alert(`${heading} button clicked!`)}
                    className="ml-2"
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
                  <td
                    key={j}
                    className="px-4 py-2 border-b border-gray-100 whitespace-nowrap"
                  >
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
  );
}

