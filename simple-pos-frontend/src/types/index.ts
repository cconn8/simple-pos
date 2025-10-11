import React from 'react';

export interface FuneralItem {
  _id: string;
  name: string;
  category: string;
  type: string;
  description: string;
  qty: number;
  isBillable: boolean | string;
  price: number;
}

export interface EditInvoiceData {
  fromDate?: string;
  toDate?: string;
  invoiceNumber?: string;
  misterMisses?: string;
  clientName?: string;
  addressLineOne?: string;
  addressLineTwo?: string;
  addressLineThree?: string;
}

export interface FuneralFormData {
  deceasedName?: string;
  dateOfDeath?: string;
  lastAddress?: string;
  clientName?: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
  funeralNotes?: string;
  selectedItems?: FuneralItem[];
  invoice?: string;
  notes?: string;
}

export interface FuneralData {
  _id: string;
  formData: FuneralFormData;
}

export interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  type: string;
  description?: string;
  qty: number;
  isBillable: string;
  price: number;
}

export interface KeyDisplay {
  key: string;
  displayText: string;
}

export interface Category {
  name: string;
  displayName: string;
}

export interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Modal Component Interfaces
export interface FieldElementProps {
  name: string;
  label: string;
  type: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface SectionContainerProps {
  children: React.ReactNode;
  heading?: string;
  className?: string;
}

export interface ProductSectionProps {
  products: InventoryItem[];
  onProductSelect: (product: InventoryItem) => void;
  selectedProducts: InventoryItem[];
}

export interface ProductTileProps extends InventoryItem {
  onSelect: (product: InventoryItem) => void;
  onRemove: (product: InventoryItem) => void;
  isSelected: boolean;
}

// Selected Funeral Item with quantity
export interface SelectedFuneralItem extends InventoryItem {
  selectedQty: number;
  totalPrice: number;
}

// Resizable Column State
export interface ColumnWidths {
  info: number;
  billing: number;
  summary: number;
}

// Form submission interface for better type safety
export interface CreateFuneralSubmission extends FuneralFormData {
  selectedItems: FuneralItem[];
}

// Delete Confirmation Modal Props
export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  itemName?: string;
}