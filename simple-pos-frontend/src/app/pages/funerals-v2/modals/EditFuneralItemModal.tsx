"use client";

import { useFuneralsContext } from "@/contexts/FuneralsContext";
import { useInventoryContext } from "@/contexts/InventoryContext";
import { useState, useEffect } from "react";

export function EditFuneralItemModal() {
  const { editingItem, isEditingFuneralItem, updateFuneralItem, stopEditingItem, keepChanges, setKeepChanges} = useFuneralsContext();
  const {updateInventoryItem } = useInventoryContext();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    selectedQty: 1
  });

  // Update form when editing item changes
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description || "",
        price: editingItem.price,
        selectedQty: editingItem.selectedQty
      });
    }
  }, [editingItem]);

  if (!isEditingFuneralItem || !editingItem) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value === '' ? '' : Number(value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async() => {
    console.log('💾 Saving funeral item changes');
    try{
      if(keepChanges && editingItem) {
        console.log('🔄 Updating inventory item in backend');
      await updateInventoryItem(editingItem._id, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
      });
        console.log('✅ Inventory item updated successfully');
      }

      updateFuneralItem(editingItem._id, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        selectedQty: Number(formData.selectedQty)
      });

      stopEditingItem();
    } catch (error) {
        console.error('Failed to save changes:', error);
        // Show user-friendly error message
    };
  }

  const handleCancel = () => {
    stopEditingItem();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Funeral Item</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Item name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (€)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              name="selectedQty"
              type="number"
              min="1"
              value={formData.selectedQty ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="1"
            />
          </div>
          <div>
            <label className="place-items-center pt-2" htmlFor="save-changes">
              Keep Changes? <input type="checkbox" name="save-changes" checked={keepChanges} onChange={() => setKeepChanges(!keepChanges)}/>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}