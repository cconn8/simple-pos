"use client";

import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import { SummaryDrawer } from "./SummaryDrawer";
import { CreateFuneralModal } from "./CreateFuneralModal";
import { UpdateFuneralModal } from "./UpdateFuneralModal";
import { EditInvoiceModal } from "./EditInvoiceModal";
import DeleteModal from "../../components/DeleteModal";
import FuneralTable from "./components/FuneralTable";
import FuneralHeader from "./components/FuneralHeader";
import { FuneralData, FuneralFormData, FuneralItem, EditInvoiceData } from '../../../types';
import { useFunerals } from '../../../hooks/useApi';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorBoundary from '../../../components/ui/ErrorBoundary';

interface FuneralDashboardState {
  isDrawerVisible: boolean;
  isCreateFuneralModalVisible: boolean;
  isCreateInventoryModalVisible: boolean;
  summaryItem: FuneralData | null;
  formData: FuneralFormData;
  invoiceLoading: string | null;
  isEditInvoiceModalVisible: boolean;
  editInvoiceData: EditInvoiceData;
  currentFuneralId: string;
  currentDeceasedName: string;
  isDeleteModalVisible: boolean;
  currentInvoiceUrl: string;
  temporaryAddedItem: FuneralItem[];
  rowItems: FuneralItem[];
  isUpdateFuneralModalVisible: boolean;
}
const initialState: FuneralDashboardState = {
  isDrawerVisible: false,
  isCreateFuneralModalVisible: false,
  isCreateInventoryModalVisible: false,
  summaryItem: null,
  formData: {},
  invoiceLoading: null,
  isEditInvoiceModalVisible: false,
  editInvoiceData: {},
  currentFuneralId: '',
  currentDeceasedName: '',
  isDeleteModalVisible: false,
  currentInvoiceUrl: '',
  temporaryAddedItem: [],
  rowItems: [
    {
      _id: uuidv4(), 
      name: '', 
      category: '', 
      type: '', 
      description: '', 
      qty: 1, 
      isBillable: false, 
      price: 0
    }
  ],
  isUpdateFuneralModalVisible: false,
};

export default function FuneralDashboard() {
  const [state, setState] = useState<FuneralDashboardState>(initialState);
  const { funerals, isLoading, error, fetchFunerals } = useFunerals();

  useEffect(() => {
    fetchFunerals();
  }, [fetchFunerals]);

  const resetState = useCallback(() => {
    setState({
      ...initialState,
      rowItems: [
        {
          _id: uuidv4(), 
          name: '', 
          category: '', 
          type: '', 
          description: '', 
          qty: 1, 
          isBillable: false, 
          price: 0
        }
      ],
    });
  }, []);

  const updateState = useCallback((updates: Partial<FuneralDashboardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleGenerateInvoice = useCallback(async (funeralId: string, deceasedName: string) => {
    updateState({
      isEditInvoiceModalVisible: true,
      currentFuneralId: funeralId,
      currentDeceasedName: deceasedName,
    });
  }, [updateState]);

  const handleOpenFuneralModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    updateState({ isCreateFuneralModalVisible: !state.isCreateFuneralModalVisible });
  }, [state.isCreateFuneralModalVisible, updateState]);

  const handleOpenDeleteFuneralModal = useCallback((funeralId: string, deceasedName: string, invoiceUrl?: string) => {
    updateState({
      currentFuneralId: funeralId,
      currentDeceasedName: deceasedName,
      currentInvoiceUrl: invoiceUrl || '',
      isDeleteModalVisible: true,
    });
  }, [updateState]);

  const openUpdateFuneralModal = useCallback(async (funeralData: FuneralData) => {
    updateState({
      currentFuneralId: funeralData._id,
      formData: funeralData.formData,
    });

    // Small delay to ensure formData is set before opening modal
    setTimeout(() => {
      updateState({ isUpdateFuneralModalVisible: true });
    }, 100);
  }, [updateState]);

  if (error) {
    return (
        <div className="bg-gray-200 flex-auto m-1 rounded-sm p-4">
          <div className="text-center text-red-600">
            <h2>Error loading funerals</h2>
            <p>{error}</p>
          </div>
        </div>
    );
  }

  return (
    <ErrorBoundary>

        <main className="bg-gray-200 flex-auto m-1 rounded-sm">
          <FuneralHeader onCreateFuneral={handleOpenFuneralModal} />
          
          <FuneralTable
            funerals={funerals}
            invoiceLoading={state.invoiceLoading}
            onGenerateInvoice={handleGenerateInvoice}
            onEditFuneral={openUpdateFuneralModal}
            onDeleteFuneral={handleOpenDeleteFuneralModal}
            isLoading={isLoading}
          />
        </main>

        {/* Modals and Drawers */}
        <SummaryDrawer 
          isDrawerVisible={state.isDrawerVisible}
          setIsDrawerVisible={(visible: boolean) => updateState({ isDrawerVisible: visible })}
          summaryItem={state.summaryItem}
          setIsUpdateFuneralModalVisible={(visible: boolean) => updateState({ isUpdateFuneralModalVisible: visible })}
          setEditFuneralData={() => {}} // TODO: Remove if not needed
        />

        <CreateFuneralModal 
          formData={state.formData}
          setFormData={(dataOrUpdater: any) => {
            if (typeof dataOrUpdater === 'function') {
              updateState({ formData: dataOrUpdater(state.formData) });
            } else {
              updateState({ formData: dataOrUpdater });
            }
          }}
          isCreateFuneralModalVisible={state.isCreateFuneralModalVisible}
          setIsCreateFuneralModalVisible={(visible: boolean) => updateState({ isCreateFuneralModalVisible: visible })}
          fetchData={fetchFunerals}
          isCreateInventoryModalVisible={state.isCreateInventoryModalVisible}
          setIsCreateInventoryModalVisible={(visible: boolean) => updateState({ isCreateInventoryModalVisible: visible })}
          rowItems={state.rowItems}
          setRowItems={(items: FuneralItem[]) => updateState({ rowItems: items })}
          temporaryAddedItem={state.temporaryAddedItem}
          setTemporaryAddedItem={(items: FuneralItem[]) => updateState({ temporaryAddedItem: items })}
          resetState={resetState}
        />

        <EditInvoiceModal 
          isEditInvoiceModalVisible={state.isEditInvoiceModalVisible}
          setIsEditInvoiceModalVisible={(visible: boolean) => updateState({ isEditInvoiceModalVisible: visible })}
          editInvoiceData={state.editInvoiceData}
          setEditInvoiceData={(data: EditInvoiceData) => updateState({ editInvoiceData: data })}
          setInvoiceLoading={(loading: string | null) => updateState({ invoiceLoading: loading })}
          funeralId={state.currentFuneralId}
          deceasedName={state.currentDeceasedName}
          fetchData={fetchFunerals}
          resetState={resetState}
        />

        <DeleteModal
          isDeleteModalVisible={state.isDeleteModalVisible}
          setIsDeleteModalVisible={(visible: boolean) => updateState({ isDeleteModalVisible: visible })}
          currentDeceasedName={state.currentDeceasedName}
          setCurrentDeceasedName={(name: string) => updateState({ currentDeceasedName: name })}
          currentFuneralId={state.currentFuneralId}
          setCurrentFuneralId={(id: string) => updateState({ currentFuneralId: id })}
          currentInvoiceUrl={state.currentInvoiceUrl}
          setCurrentInvoiceUrl={(url: string) => updateState({ currentInvoiceUrl: url })}
          fetchData={fetchFunerals}
          resetState={resetState}
        />

        <UpdateFuneralModal
          formData={state.formData}
          setFormData={(dataOrUpdater: any) => {
            if (typeof dataOrUpdater === 'function') {
              updateState({ formData: dataOrUpdater(state.formData) });
            } else {
              updateState({ formData: dataOrUpdater });
            }
          }}
          isUpdateFuneralModalVisible={state.isUpdateFuneralModalVisible}
          setIsUpdateFuneralModalVisible={(visible: boolean) => updateState({ isUpdateFuneralModalVisible: visible })}
          fetchData={fetchFunerals}
          isCreateInventoryModalVisible={state.isCreateInventoryModalVisible}
          setIsCreateInventoryModalVisible={(visible: boolean) => updateState({ isCreateInventoryModalVisible: visible })}
          rowItems={state.rowItems}
          setRowItems={(items: FuneralItem[]) => updateState({ rowItems: items })}
          temporaryAddedItem={state.temporaryAddedItem}
          setTemporaryAddedItem={(items: FuneralItem[]) => updateState({ temporaryAddedItem: items })}
          currentFuneralId={state.currentFuneralId}
          setCurrentFuneralId={(id: string) => updateState({ currentFuneralId: id })}
          resetState={resetState}
        />
    </ErrorBoundary>
  );
}