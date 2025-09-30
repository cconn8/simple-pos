"use client";

import React, { memo } from 'react';
import Link from "next/link";
import { RefreshCw } from "@deemlol/next-icons";
import { FuneralData } from '../../../../types';
import Button from '../../../../components/ui/Button';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';

interface FuneralTableProps {
  funerals: FuneralData[];
  invoiceLoading: string | null;
  onGenerateInvoice: (funeralId: string, deceasedName: string) => void;
  onEditFuneral: (funeral: FuneralData) => void;
  onDeleteFuneral: (funeralId: string, deceasedName: string, invoiceUrl?: string) => void;
  isLoading?: boolean;
}

const FuneralTable = memo(({ 
  funerals, 
  invoiceLoading, 
  onGenerateInvoice, 
  onEditFuneral, 
  onDeleteFuneral,
  isLoading = false 
}: FuneralTableProps) => {
  if (isLoading) {
    return <LoadingSpinner className="p-8" text="Loading funerals..." />;
  }

  return (
    <section className="bg-gray-300 my-2 m-1 rounded-sm">
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Deceased Name</th>
              <th className="px-4 py-2 text-left">Date of Death</th>
              <th className="px-4 py-2 text-left">Invoice</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {funerals.length > 0 ? (
              funerals.map((funeral) => (
                funeral.formData && (
                  <tr key={funeral._id} className="border-b border-white hover:bg-gray-100 transition-colors">
                    <td className="px-4 py-2">{funeral.formData.deceasedName}</td>
                    <td className="px-4 py-2">
                      {funeral.formData.dateOfDeath 
                        ? new Date(funeral.formData.dateOfDeath).toLocaleDateString('en-GB')
                        : 'N/A'
                      }
                    </td>
                    <td className="px-4 py-2">
                      {invoiceLoading === funeral._id ? (
                        <LoadingSpinner size="sm" text="Generating..." />
                      ) : funeral.formData.invoice ? (
                        <div className="flex items-center space-x-2">
                          <Link
                            href={funeral.formData.invoice}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {funeral.formData.deceasedName}-invoice
                          </Link>
                          <button
                            onClick={() => onGenerateInvoice(funeral._id, funeral.formData.deceasedName || '')}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Regenerate invoice"
                          >
                            <RefreshCw size={20} color="black" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => onGenerateInvoice(funeral._id, funeral.formData.deceasedName || '')}
                          variant="secondary"
                          size="sm"
                        >
                          Generate Invoice
                        </Button>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => onEditFuneral(funeral)}
                          variant="ghost"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => onDeleteFuneral(
                            funeral._id, 
                            funeral.formData.deceasedName || '', 
                            funeral.formData.invoice
                          )}
                          variant="danger"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center">
                  <h2 className="text-lg text-gray-600">No funerals recorded</h2>
                  <p className="text-gray-500 mt-2">Create your first funeral record to get started</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
});

FuneralTable.displayName = 'FuneralTable';

export default FuneralTable;