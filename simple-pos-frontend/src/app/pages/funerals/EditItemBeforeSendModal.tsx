import React, { useCallback } from 'react';
import { FuneralFormData, FuneralItem } from '../../../types';
import Button from '../../../components/ui/Button';

interface EditItemBeforeSubmitModalProps {
  isEditItemBeforeSubmitModalVisible: boolean;
  setIsEditItemBeforeSubmitModalVisible: (visible: boolean) => void;
  selectedItem: FuneralItem | null;
  setSelectedItem: (item: FuneralItem | null) => void;
  formData: FuneralFormData;
  setFormData: React.Dispatch<React.SetStateAction<FuneralFormData>>;
}

export function EditItemBeforeSubmitModal({
  isEditItemBeforeSubmitModalVisible,
  setIsEditItemBeforeSubmitModalVisible,
  selectedItem,
  setSelectedItem,
  formData,
  setFormData,
}: EditItemBeforeSubmitModalProps) {
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault(); 
    
    if (!selectedItem) return;
    
    setFormData((prev) => {
      const existingItems = prev.selectedItems || [];
      const itemIndex = existingItems.findIndex((existingItem) => existingItem._id === selectedItem._id);
      
      if (itemIndex !== -1) {
        // Item exists - update it
        const updatedItems = [...existingItems];
        const existingItem = updatedItems[itemIndex];
        updatedItems[itemIndex] = {
          ...existingItem,
          qty: (existingItem.qty || 1) + 1,
          price: selectedItem.price || 0,
        };
        return {
          ...prev,
          selectedItems: updatedItems,
        };
      } else {
        // Item not selected - add with qty 1
        return {
          ...prev,
          selectedItems: [...existingItems, { 
            ...selectedItem, 
            qty: 1, 
            price: selectedItem.price || 0 
          }],
        };
      }
    });        
    setIsEditItemBeforeSubmitModalVisible(false);
  }, [selectedItem, setFormData, setIsEditItemBeforeSubmitModalVisible]);

  const handleDiscard = useCallback(() => {
    setSelectedItem(null);
    setIsEditItemBeforeSubmitModalVisible(false);
  }, [setSelectedItem, setIsEditItemBeforeSubmitModalVisible]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!selectedItem) return;
    
    setSelectedItem({
      ...selectedItem,
      [name]: name === 'price' || name === 'qty' ? parseInt(value) || 0 : value,
    });
  }, [selectedItem, setSelectedItem]);

  // Early return if no selected item - after all hooks
  if (!selectedItem) {
    return null;
  }

  return (
    <div className={`p-4 flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-30 shadow-lg rounded-lg w-96 flex border ${isEditItemBeforeSubmitModalVisible ? 'visible' : 'hidden'}`}>
      <header className="flex flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Item Price</h2>
        <Button 
          variant="ghost" 
          onClick={() => setIsEditItemBeforeSubmitModalVisible(false)}
          className="text-xl font-bold hover:bg-gray-100"
        >
          ×
        </Button>
      </header>

      <div className="flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input 
              id="itemName" 
              type="text" 
              value={selectedItem.name || ''} 
              readOnly 
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (€)
            </label>
            <input 
              onChange={handleChange} 
              id="price" 
              type="number" 
              name="price" 
              value={selectedItem.price || ''} 
              placeholder="Enter price" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="flex flex-row gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={handleDiscard} className="flex-1">
              Discard
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}