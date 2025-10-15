"use client";

import React, { useEffect, useState, useCallback } from "react";
import MainSidebar from "../../components/MainSidebar/MainSidebar";
import { CreateInventoryModal } from "./CreateInventoryModal";
import { v4 as uuidv4 } from 'uuid';
import { InventoryItem } from '../../../types';
import { useInventory } from '../../../hooks/useApi';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Button from '../../../components/ui/Button';
import ErrorBoundary from '../../../components/ui/ErrorBoundary';

export default function InventoryDashboard() {
  const [isCreateInventoryModalVisible, setIsCreateInventoryModalVisible] = useState(false);
  const [rowItems, setRowItems] = useState<InventoryItem[]>([
    {
      _id: uuidv4(), 
      name: '', 
      category: '', 
      type: '', 
      description: '', 
      qty: 1, 
      isBillable: '', 
      price: 0
    }
  ]);
  
  const { inventory, isLoading, error, fetchInventory, deleteInventoryItem } = useInventory();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleOpenModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsCreateInventoryModalVisible(!isCreateInventoryModalVisible);
  }, [isCreateInventoryModalVisible]);

  const handleDeleteItem = useCallback(async (id: string) => {
    const success = await deleteInventoryItem(id);
    if (success) {
      await fetchInventory();
      setIsCreateInventoryModalVisible(false);
    }
  }, [deleteInventoryItem, fetchInventory]);

  if (error) {
    return (
      <div className="flex flex-row p-5">
        <MainSidebar />
        <div className="bg-gray-200 flex-auto m-1 rounded-sm p-4">
          <div className="text-center text-red-600">
            <h2>Error loading inventory</h2>
            <p>{error}</p>
            <Button onClick={() => fetchInventory()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-row p-5">
        <MainSidebar />

        <main className="bg-gray-200 flex-auto m-1 rounded-sm">
          <header className="flex flex-row bg-gray-400 justify-between m-1 rounded-sm">
            <div className="my-2 px-4">
              <h1 className="text-xl font-semibold">Inventory</h1>
            </div>
            
            <Button 
              onClick={handleOpenModal}
              className="m-2"
              variant="secondary"
            >
              + Add Item
            </Button>
          </header>

          <section className="bg-gray-300 my-2 m-1 rounded-sm">
            {isLoading ? (
              <LoadingSpinner className="p-8" />
            ) : (
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Item Name</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.length > 0 ? (
                      inventory.map((item: InventoryItem) => (
                        <tr key={item._id} className="border-b border-white hover:bg-gray-100 transition-colors">
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="px-4 py-2">{item.category}</td>
                          <td className="px-4 py-2">{item.type}</td>
                          <td className="px-4 py-2">€{item.price}</td>
                          <td className="px-4 py-2">
                            <Button 
                              onClick={() => handleDeleteItem(item._id)}
                              variant="danger"
                              size="sm"
                            > 
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center">
                          <h2 className="text-lg text-gray-600">No items in inventory</h2>
                          <p className="text-gray-500 mt-2">Add your first item to get started</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>

        <CreateInventoryModal 
          isCreateInventoryModalVisible={isCreateInventoryModalVisible}
          setIsCreateInventoryModalVisible={setIsCreateInventoryModalVisible}
          rowItems={rowItems}
          setRowItems={setRowItems}
          fetchData={fetchInventory}
          temporaryAddedItem={[]}
          setTemporaryAddedItem={() => {}}
        />
      </div>
    </ErrorBoundary>
  );
}