
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DisplayGroupTiles } from "./DisplayGroupTiles";
import { CreateInventoryModal } from '../inventory/CreateInventoryModal';
import { EditItemBeforeSubmitModal } from './EditItemBeforeSendModal';
import { DESIRED_CATEGORY_ORDER } from '../../../config/funeral-categories';
import { FuneralFormData, FuneralItem, InventoryItem } from '../../../types';
import { useInventory } from '../../../hooks/useApi';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Button from '../../../components/ui/Button';

interface CreateFuneralModalProps {
  formData: FuneralFormData;
  setFormData: React.Dispatch<React.SetStateAction<FuneralFormData>>;
  isCreateFuneralModalVisible: boolean;
  setIsCreateFuneralModalVisible: (visible: boolean) => void;
  fetchData: () => Promise<any>;
  isCreateInventoryModalVisible: boolean;
  setIsCreateInventoryModalVisible: (visible: boolean) => void;
  rowItems: FuneralItem[];
  setRowItems: (items: FuneralItem[]) => void;
  temporaryAddedItem: FuneralItem[];
  setTemporaryAddedItem: (items: FuneralItem[]) => void;
  resetState: () => void;
}

export function CreateFuneralModal({
  formData, 
  setFormData, 
  isCreateFuneralModalVisible, 
  setIsCreateFuneralModalVisible, 
  fetchData, 
  isCreateInventoryModalVisible, 
  setIsCreateInventoryModalVisible, 
  rowItems, 
  setRowItems,
  temporaryAddedItem,
  setTemporaryAddedItem,
  resetState
}: CreateFuneralModalProps) {


  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [selectedItem, setSelectedItem] = useState<FuneralItem | null>(null);
  const [isEditItemBeforeSubmitModalVisible, setIsEditItemBeforeSubmitModalVisible] = useState(false);
  
  const { inventory: inventoryData, fetchInventory } = useInventory();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Use imported category order
  const desiredCategoryOrder = DESIRED_CATEGORY_ORDER;

  const groupedItemsByCategory = inventoryData.reduce((acc: Record<string, InventoryItem[]>, item: InventoryItem) => {
    const categoryKey = item.category.toLowerCase();
    if (!acc[categoryKey]) acc[categoryKey] = [];
    acc[categoryKey].push(item);
    return acc;
  }, {});

  // Add temporary items to grouped categories
  if (temporaryAddedItem.length > 0) {
    temporaryAddedItem.forEach((item) => {
      const categoryKey = item.category.toLowerCase();
      if (!groupedItemsByCategory[categoryKey]) groupedItemsByCategory[categoryKey] = [];
      groupedItemsByCategory[categoryKey].push(item as InventoryItem);
    });
  }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, [setFormData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/funerals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      await response.json();
      await fetchData();
      resetState();
    } catch (error) {
      console.error("Error submitting funeral data:", error);
    }
  }, [formData, API_URL, fetchData, resetState]);

  const handleDeleteSelectedItem = useCallback((id: string) => {
    setFormData(prevItems => {
      const updatedSelectedItems = prevItems.selectedItems?.filter((item) => item._id !== id) || [];
      return {
        ...prevItems,
        selectedItems: updatedSelectedItems
      };
    });
  }, [setFormData]);

  const handleClearAll = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      selectedItems: []
    }));
  }, [setFormData]);

    return (

        <div className={`p-2 flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 shadow-lg rounded-lg w-11/12 h-5/6 flex border ${isCreateFuneralModalVisible ? 'visible' : 'hidden'}`}>
            <header className="flex flex-row justify-between py-5 border-b">
                <h1 className="text-2xl font-bold">Create Funeral</h1>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsCreateFuneralModalVisible(false)}
                  className="text-xl font-bold hover:bg-gray-100"
                >
                  ×
                </Button>
            </header>

            <div className="flex basis-2/3 flex-row flex-grow overflow-auto">
                <div className='flex basis-2/3'>
                    <form id="createFuneralForm" className="overflow-y-auto flex-1 p-4" onSubmit={handleSubmit}>
                        <section className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h2 className="text-lg font-semibold mb-3">Deceased Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input 
                                  onChange={handleChange} 
                                  id="deceasedName" 
                                  type="text" 
                                  name="deceasedName" 
                                  value={formData.deceasedName || ""} 
                                  placeholder="Deceased Name" 
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input 
                                  onChange={handleChange} 
                                  id="dateOfDeath" 
                                  type="date" 
                                  name="dateOfDeath" 
                                  value={formData.dateOfDeath || ""} 
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input 
                                  onChange={handleChange} 
                                  id="lastAddress" 
                                  type="text" 
                                  name="lastAddress" 
                                  value={formData.lastAddress || ""} 
                                  placeholder="Last Address" 
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </section>

                        <section className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h2 className="text-lg font-semibold mb-3">Client Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                  onChange={handleChange} 
                                  id="clientName" 
                                  type="text" 
                                  name="clientName" 
                                  value={formData.clientName || ""} 
                                  placeholder="Client Name" 
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input 
                                  onChange={handleChange} 
                                  id="clientAddress" 
                                  type="text" 
                                  name="clientAddress" 
                                  value={formData.clientAddress || ""} 
                                  placeholder="Client Address" 
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input 
                                  onChange={handleChange} 
                                  id="clientPhone" 
                                  type="tel" 
                                  name="clientPhone" 
                                  value={formData.clientPhone || ""} 
                                  placeholder="Phone Number" 
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input 
                                  onChange={handleChange} 
                                  id="clientEmail" 
                                  type="email" 
                                  name="clientEmail" 
                                  value={formData.clientEmail || ""} 
                                  placeholder="Email Address" 
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </section>

                        <section className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h2 className="text-lg font-semibold mb-3">Funeral Notes & Details</h2>
                            <textarea 
                              onChange={handleChange} 
                              id="funeralNotes" 
                              name="funeralNotes" 
                              value={formData.funeralNotes || ""} 
                              placeholder="Enter any special notes or details about the funeral arrangements..." 
                              rows={4}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                            />
                        </section>

                        <section className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h2 className="text-lg font-semibold mb-4">Billable Items</h2>

                            {desiredCategoryOrder.map((category) => (
                                <div key={category.name} className="border-b border-gray-200 py-4 last:border-b-0">
                                    <h3 className="text-md font-semibold text-gray-700 mb-3">{category.displayName}</h3>

                                    <DisplayGroupTiles 
                                        items={groupedItemsByCategory[category.name] || []} 
                                        formData={formData} 
                                        setFormData={setFormData} 
                                        category={category.name}
                                        rowItems={rowItems}
                                        setRowItems={setRowItems}
                                        isCreateInventoryModalVisible={isCreateInventoryModalVisible}
                                        setIsCreateInventoryModalVisible={setIsCreateInventoryModalVisible}
                                        temporaryAddedItem={temporaryAddedItem}
                                        setTemporaryAddedItem={setTemporaryAddedItem}
                                        isEditItemBeforeSubmitModalVisible={isEditItemBeforeSubmitModalVisible}
                                        setIsEditItemBeforeSubmitModalVisible={setIsEditItemBeforeSubmitModalVisible}
                                        selectedItem={selectedItem}  //selected item is to populate the edit before submit modal with the selected item
                                        setSelectedItem={setSelectedItem}
                                    />
                                </div>
                            ))}
                        </section>
                    </form>
                </div>

                <aside className="sticky top-0 flex basis-1/3 flex-col p-4 bg-gray-50 rounded-lg ml-4 overflow-auto">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Funeral Summary</h2>
                    </div>

                    <div className="space-y-3">
                        {/* Deceased Details Summary */}
                        {(formData.deceasedName || formData.dateOfDeath || formData.lastAddress) && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-gray-700 mb-2">Deceased Information</h3>
                            {formData.deceasedName && (
                              <p className="text-sm"><span className="font-medium">Name:</span> {formData.deceasedName}</p>
                            )}
                            {formData.dateOfDeath && (
                              <p className="text-sm"><span className="font-medium">Date of Death:</span> {formData.dateOfDeath}</p>
                            )}
                            {formData.lastAddress && (
                              <p className="text-sm"><span className="font-medium">Last Address:</span> {formData.lastAddress}</p>
                            )}
                          </div>
                        )}

                        {/* Client Details Summary */}
                        {(formData.clientName || formData.clientAddress || formData.clientPhone || formData.clientEmail) && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-gray-700 mb-2">Client Information</h3>
                            {formData.clientName && (
                              <p className="text-sm"><span className="font-medium">Name:</span> {formData.clientName}</p>
                            )}
                            {formData.clientAddress && (
                              <p className="text-sm"><span className="font-medium">Address:</span> {formData.clientAddress}</p>
                            )}
                            {formData.clientPhone && (
                              <p className="text-sm"><span className="font-medium">Phone:</span> {formData.clientPhone}</p>
                            )}
                            {formData.clientEmail && (
                              <p className="text-sm"><span className="font-medium">Email:</span> {formData.clientEmail}</p>
                            )}
                          </div>
                        )}

                        {formData.funeralNotes && (
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
                            <p className="text-sm text-gray-600">{formData.funeralNotes}</p>
                          </div>
                        )}
                    </div>
                    
                    <div className="mt-6">
                        <h3 className="font-semibold text-gray-700 mb-3">Selected Items</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {formData.selectedItems && formData.selectedItems.length > 0 ? (
                            formData.selectedItems.map((item, index) => {
                              const price = item?.price || 0;
                              const qty = item?.qty || 0;
                              const name = item?.name || 'Unknown item';
                              const itemDisplayTitle = qty > 1
                                ? `${name} x ${qty} (€${price.toFixed(2)}/unit) = €${(qty * price).toFixed(2)}`
                                : `${name} - €${price.toFixed(2)}`;

                              return (
                                <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                                  <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium text-gray-800 flex-1">{itemDisplayTitle}</p>
                                    <Button 
                                      onClick={() => handleDeleteSelectedItem(item._id)}
                                      variant="danger"
                                      size="sm"
                                      className="ml-2"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center p-4 bg-gray-100 rounded-lg">
                              <p className="text-sm text-gray-500">No items selected</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Total calculation */}
                        {formData.selectedItems && formData.selectedItems.length > 0 && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-700">Total:</span>
                              <span className="font-bold text-lg text-blue-600">
                                €{formData.selectedItems.reduce((total, item) => {
                                  const price = item?.price || 0;
                                  const qty = item?.qty || 0;
                                  return total + (qty * price);
                                }, 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="flex flex-row gap-3 mt-6">
                        <Button 
                          type="submit" 
                          form="createFuneralForm" 
                          variant="primary"
                          className="flex-1"
                        >
                          Save Funeral
                        </Button>
                        <Button 
                          onClick={handleClearAll} 
                          variant="secondary"
                          className="flex-1"
                        >
                          Clear All
                        </Button>
                    </div>
                </aside>
            </div>

            <CreateInventoryModal
                isCreateInventoryModalVisible={isCreateInventoryModalVisible}
                setIsCreateInventoryModalVisible={setIsCreateInventoryModalVisible}
                rowItems={rowItems}
                setRowItems={setRowItems}
                fetchData={fetchData}
                temporaryAddedItem={temporaryAddedItem}
                setTemporaryAddedItem={setTemporaryAddedItem}
            />

            <EditItemBeforeSubmitModal 
                isEditItemBeforeSubmitModalVisible={isEditItemBeforeSubmitModalVisible}
                setIsEditItemBeforeSubmitModalVisible={setIsEditItemBeforeSubmitModalVisible}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                formData={formData}
                setFormData={setFormData}
            />
        </div>
    )
}