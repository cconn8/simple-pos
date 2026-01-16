"use client";

import React, { useState, useEffect } from 'react';
import { X } from '@deemlol/next-icons';
import { FuneralRecordV2 } from '@/types/funeralV2';

interface XeroPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  funeral: FuneralRecordV2 | null;
  onConfirmPost: (postingData: XeroPostingData) => void;
}

export interface XeroPostingData {
  // XERO Contact API Fields (Required: Name only)
  contactName: string;              // Required for Contact creation
  contactEmail?: string;            // Optional
  contactPhone?: string;            // Optional
  contactFirstName?: string;        // Optional - for contact persons
  contactLastName?: string;         // Optional - for contact persons
  
  // XERO Contact Address (Optional but recommended)
  addressLine1?: string;            // Street address
  addressLine2?: string;            // Additional address info
  city?: string;                    // City/town
  region?: string;                  // State/region  
  postalCode?: string;              // ZIP/postal code
  country?: string;                 // Country
  
  // XERO Invoice API Fields
  invoiceType: 'ACCREC' | 'ACCPAY'; // Required: ACCREC for sales invoice
  invoiceNumber?: string;           // Optional - XERO can auto-generate
  reference?: string;               // Optional - appears on invoice
  invoiceDate?: string;             // Optional - defaults to today
  dueDate?: string;                 // Optional - payment due date
  invoiceStatus?: 'DRAFT' | 'SUBMITTED' | 'AUTHORISED'; // Invoice status (PAID not allowed for creation)
  
  // XERO Line Item Fields (Required)
  lineItemDescription: string;      // Required: Description of service
  lineItemQuantity: number;         // Required: Quantity (usually 1 for funeral services)
  lineItemUnitAmount: number;       // Required: Unit price
  lineItemAccountCode?: string;     // Required for XERO - default sales account
  
  // Internal Fields
  funeralId: string;
  deceasedName: string;
  totalAmount: number;                  // Total amount for the invoice
}

export default function XeroPostingModal({ isOpen, onClose, funeral, onConfirmPost }: XeroPostingModalProps) {
  const [formData, setFormData] = useState<XeroPostingData>({
    // XERO Contact fields
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactFirstName: '',
    contactLastName: '',
    
    // XERO Contact Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'Ireland', // Default for Irish funeral home
    
    // XERO Invoice fields
    invoiceType: 'ACCREC', // Sales invoice
    invoiceNumber: '',
    reference: '',
    invoiceDate: new Date().toISOString().split('T')[0], // Today's date
    dueDate: '',
    invoiceStatus: 'AUTHORISED', // Default to approved status
    
    // XERO Line Item fields
    lineItemDescription: '',
    lineItemQuantity: 1,
    lineItemUnitAmount: 0,
    lineItemAccountCode: '200', // Default sales account - configurable
    
    // Internal fields
    funeralId: '',
    deceasedName: '',
    totalAmount: 0
  });

  const [isPosting, setIsPosting] = useState(false);

  // Populate form data when funeral changes
  useEffect(() => {
    if (funeral && isOpen) {
      const totalAmount = funeral.funeralData.selectedItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
      
      // Parse address into components
      const clientAddress = funeral.funeralData.client.address || '';
      const addressParts = clientAddress.split(',').map(part => part.trim());
      
      setFormData({
        // XERO Contact fields  
        contactName: funeral.funeralData.client.name || funeral.funeralData.billing.name || '',
        contactEmail: funeral.funeralData.client.email || '',
        contactPhone: funeral.funeralData.client.phone || '',
        contactFirstName: '', // Parse from contactName if needed
        contactLastName: '',  // Parse from contactName if needed
        
        // XERO Contact Address
        addressLine1: addressParts[0] || '',
        addressLine2: addressParts[1] || '',
        city: addressParts[addressParts.length - 2] || '',
        region: '', // Not typically in Irish addresses
        postalCode: '', // Irish Eircodes if available
        country: 'Ireland',
        
        // XERO Invoice fields
        invoiceType: 'ACCREC',
        invoiceNumber: funeral.funeralData.invoice.invoiceNumber || funeral.funeralData.billing.invoiceNumber || `INV-${funeral._id.slice(-6)}`,
        reference: funeral.funeralData.deceasedName, // Default to deceased name
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from today
        invoiceStatus: 'AUTHORISED', // Default to approved/awaiting payment
        
        // XERO Line Item fields
        lineItemDescription: `Funeral services provided for the late ${funeral.funeralData.deceasedName}`,
        lineItemQuantity: 1,
        lineItemUnitAmount: totalAmount,
        lineItemAccountCode: '200', // Default sales account
        
        // Internal fields
        funeralId: funeral._id,
        deceasedName: funeral.funeralData.deceasedName,
        totalAmount: totalAmount
      });
    }
  }, [funeral, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'lineItemUnitAmount' || name === 'lineItemQuantity' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPosting(true);
    
    try {
      await onConfirmPost(formData);
      onClose();
    } catch (error) {
      console.error('Error posting to XERO:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    if (!isPosting) {
      onClose();
    }
  };

  if (!isOpen || !funeral) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-full flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Post to XERO - {funeral.funeralData.deceasedName}
          </h2>
          <button
            onClick={handleClose}
            disabled={isPosting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* XERO Contact Details Section */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">🔷 XERO Contact Details</h3>
              <p className="text-sm text-gray-600 mb-4">This will create/update a contact in XERO</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name * <span className="text-xs text-gray-500">(Required by XERO)</span>
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* XERO Invoice Details Section */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">🧾 XERO Invoice Details</h3>
              <p className="text-sm text-gray-600 mb-4">This will create a sales invoice in XERO</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="invoiceType" className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Type * <span className="text-xs text-gray-500">(Required by XERO)</span>
                  </label>
                  <select
                    id="invoiceType"
                    name="invoiceType"
                    value={formData.invoiceType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACCREC">ACCREC (Sales Invoice)</option>
                    <option value="ACCPAY">ACCPAY (Bill)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number <span className="text-xs text-gray-500">(XERO can auto-generate)</span>
                  </label>
                  <input
                    type="text"
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                    Reference
                  </label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    id="invoiceDate"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date <span className="text-xs text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="invoiceStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Status <span className="text-xs text-gray-500">(XERO Status)</span>
                  </label>
                  <p className="text-xs text-blue-600 mb-2">Note: Invoices must be marked as paid manually in XERO after creation</p>
                  <select
                    id="invoiceStatus"
                    name="invoiceStatus"
                    value={formData.invoiceStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SUBMITTED">Awaiting Approval</option>
                    <option value="AUTHORISED">Awaiting Payment</option>
                  </select>
                </div>
              </div>
            </div>

            {/* XERO Line Item Section */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">📋 XERO Line Item Details</h3>
              <p className="text-sm text-gray-600 mb-4">This appears as the service line on the invoice</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="lineItemDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Description * <span className="text-xs text-gray-500">(Required by XERO)</span>
                  </label>
                  <textarea
                    id="lineItemDescription"
                    name="lineItemDescription"
                    rows={2}
                    value={formData.lineItemDescription}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="lineItemQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity * <span className="text-xs text-gray-500">(Required by XERO)</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    id="lineItemQuantity"
                    name="lineItemQuantity"
                    value={formData.lineItemQuantity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="lineItemUnitAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Amount (€) * <span className="text-xs text-gray-500">(Required by XERO)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="lineItemUnitAmount"
                    name="lineItemUnitAmount"
                    value={formData.lineItemUnitAmount}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="lineItemAccountCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Code <span className="text-xs text-gray-500">(Default: 200 - Sales)</span>
                  </label>
                  <input
                    type="text"
                    id="lineItemAccountCode"
                    name="lineItemAccountCode"
                    value={formData.lineItemAccountCode}
                    onChange={handleInputChange}
                    placeholder="200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Selected Items Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">📦 Original Funeral Items</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {funeral.funeralData.selectedItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} (x{item.qty})</span>
                    <span>€{(item.qty * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-medium">
                <span>Items Total:</span>
                <span>€{funeral.funeralData.selectedItems.reduce((sum, item) => sum + (item.qty * item.price), 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-blue-200 mt-3 pt-3 flex justify-between font-bold text-lg">
                <span>XERO Invoice Total:</span>
                <span>€{(formData.lineItemQuantity * formData.lineItemUnitAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPosting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPosting}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isPosting ? (
                <span className="flex items-center gap-2">
                  🔄 Posting to XERO...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  📤 Post to XERO
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}