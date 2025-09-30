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