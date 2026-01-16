"use client";

import { useFuneralsContext } from "@/contexts/FuneralsContext";
import { useFuneralsV2 } from "@/hooks/useFuneralsV2";
import { Edit3, X } from "@deemlol/next-icons";
import dateFormat from 'dateformat';

export function FuneralDetailDrawer() {
  // Get UI state from context (still needed for modal management)
  const { 
    showFuneralDetail, 
    setShowFuneralDetail, 
    viewingFuneral,
    setViewingFuneral,
    setShowFuneralModal,
    setIsEditMode,
    setSelectedFuneralItems,
    setEditingFuneralData,
    setShowXeroPostingModal,
    setXeroPostingFuneral
  } = useFuneralsContext();

  // Get V2 funeral data (for type safety and proper data access)
  const { funerals } = useFuneralsV2();
  
  // Find the V2 version of the viewing funeral
  const viewingFuneralV2 = funerals.find(funeral => funeral._id === viewingFuneral?._id);

  if (!showFuneralDetail || !viewingFuneral || !viewingFuneralV2) return null;

  const handleClose = () => {
    setShowFuneralDetail(false);
    setViewingFuneral(null);
  };

  const handleEdit = () => {
    // Set edit mode and populate the form
    setIsEditMode(true);
    
    // Convert funeral items back to SelectedFuneralItem format for editing
    const editableItems = viewingFuneralV2.funeralData.selectedItems?.map(item => ({
      ...item,
      selectedQty: item.qty,
      totalPrice: item.qty * item.price,
      isBillable: String(item.isBillable) // Ensure string type
    })) || [];
    
    setSelectedFuneralItems(editableItems);
    
    // Set the V2 funeral data for the CreateFuneralModal to use
    setEditingFuneralData(viewingFuneralV2.funeralData);
    
    // Close detail drawer and open edit modal
    setShowFuneralDetail(false);
    setShowFuneralModal(true);
  };

  const handlePostToXero = () => {
    if (viewingFuneralV2) {
      setXeroPostingFuneral(viewingFuneralV2);
      setShowXeroPostingModal(true);
    }
  };

  const formatFieldValue = (key: string, value: string | undefined): string => {
    if (!value) return "";
    if (key.toLowerCase().includes('date')) {
      return dateFormat(value, "dddd, mmmm dS, yyyy");
    }
    return value;
  };

  const getFieldDisplayName = (key: string): string => {
    const fieldMap: Record<string, string> = {
      deceasedName: "Deceased Name",
      dateOfDeath: "Date of Death", 
      lastAddress: "Last Address",
      clientName: "Client Name",
      clientAddress: "Client Address",
      clientPhone: "Client Phone",
      funeralNotes: "Funeral Notes",
      contactName1: "Contact 1",
      phone1: "Contact 1 Phone",
      contactName2: "Contact 2",
      phone2: "Contact 2 Phone",
      careOf: "C/O",
      billingName: "Billing Name",
      billingAddress: "Billing Address",
      fromDate: 'From',
      toDate: 'To'
    };
    return fieldMap[key] || key;
  };

  // Access V2 data structure for display
  const formData = {
    deceasedName: viewingFuneralV2.funeralData.deceasedName,
    dateOfDeath: viewingFuneralV2.funeralData.dateOfDeath,
    lastAddress: viewingFuneralV2.funeralData.lastAddress,
    clientName: viewingFuneralV2.funeralData.client.name,
    clientAddress: viewingFuneralV2.funeralData.client.address,
    clientPhone: viewingFuneralV2.funeralData.client.phone,
    clientEmail: viewingFuneralV2.funeralData.client.email,
    billingName: viewingFuneralV2.funeralData.billing.name,
    billingAddress: viewingFuneralV2.funeralData.billing.address,
    careOf: viewingFuneralV2.funeralData.billing.careOf,
    contactName1: viewingFuneralV2.funeralData.contacts.contactName1,
    phone1: viewingFuneralV2.funeralData.contacts.phone1,
    contactName2: viewingFuneralV2.funeralData.contacts.contactName2,
    phone2: viewingFuneralV2.funeralData.contacts.phone2,
    fromDate: viewingFuneralV2.funeralData.fromDate,
    toDate: viewingFuneralV2.funeralData.toDate,
    funeralNotes: viewingFuneralV2.funeralData.funeralNotes,
    notes: viewingFuneralV2.funeralData.notes
  };
  const selectedItems = viewingFuneralV2.funeralData.selectedItems || [];
  const total = selectedItems.reduce((sum, item) => sum + (item.qty * item.price), 0);

  return (
    <div className="fixed bg-gray-100 bg-opacity-25 inset-0 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 w-3/4 rounded-lg shadow-xl mx-4 h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Funeral Details</h2>
          <div className="flex items-center gap-2">
            {/* Show Post to XERO button if: 
                1. Payment status is Paid or Partially Paid 
                2. Not already posted to XERO */}
            {(viewingFuneralV2.paymentStatus === 'Paid' || viewingFuneralV2.paymentStatus === 'Partially Paid') && 
             !viewingFuneralV2.xeroData?.invoiceId && (
              <button
                onClick={handlePostToXero}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                title="Post invoice to XERO"
                disabled={viewingFuneralV2.xeroData?.status === 'posting'}
              >
                📤 Post to XERO
              </button>
            )}
            
            {/* Show XERO status if already posted */}
            {viewingFuneralV2.xeroData?.invoiceId && (
              <div className="flex items-center gap-1 px-3 py-2 text-sm bg-green-100 text-green-800 rounded">
                ✅ Posted to XERO
              </div>
            )}
            
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              title="Edit this funeral"
            >
              <Edit3 size={16} />
              Edit
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Form Data Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Funeral Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => {
                if (key === 'selectedItems' || !value) return null;
                return (
                  <div key={key} className="border-b border-gray-100 pb-2">
                    <span className="text-sm font-medium text-gray-600">{getFieldDisplayName(key)}:</span>
                    <p className="text-gray-900">{formatFieldValue(key, value)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Items Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Selected Items</h3>
            {selectedItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No items selected</p>
            ) : (
              <div className="space-y-3">
                {selectedItems.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description || "No description"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Category: {item.category}</span>
                          <span>Type: {item.type}</span>
                          <span>Billable: {item.isBillable}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-gray-900">€{(item.qty * item.price).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{item.qty} x €{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Section */}
          {selectedItems.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-gray-900">€{total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}