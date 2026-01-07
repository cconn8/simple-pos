"use client";

import { InventoryProvider } from '@/contexts/InventoryContext';
import FuneralHeader from './components/FuneralHeader';
import FuneralTable from './components/FuneralTable';
import CreateFuneralModal from './modals/CreateFuneralModal';
import { FuneralsProvider } from '@/contexts/FuneralsContext';
import { EditFuneralItemModal } from './modals/EditFuneralItemModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { FuneralDetailDrawer } from './components/FuneralDetailDrawer';
import { useFuneralsContext } from '@/contexts/FuneralsContext';
import { useFunerals } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ProtectedRoute';



export default function FuneralsPage() {
        
    
    function FuneralContent(){
        const { 
            showDeleteModal, 
            setShowDeleteModal, 
            deleteTarget, 
            setDeleteTarget 
        } = useFuneralsContext();
        
        const { deleteFuneral } = useFunerals();

        const handleDeleteConfirm = async () => {
            if (deleteTarget) {
                try {
                    await deleteFuneral(deleteTarget.id);
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                } catch (error) {
                    console.error('Error deleting funeral:', error);
                }
            }
        };

        const handleDeleteCancel = () => {
            setShowDeleteModal(false);
            setDeleteTarget(null);
        };

        return(
            <div className='flex flex-col w-full'>
                <FuneralHeader />
                <FuneralTable />
                <CreateFuneralModal />
                <EditFuneralItemModal />
                <FuneralDetailDrawer />
                
                {/* Delete Modal - gets props from context */}
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    title="Delete Funeral Record"
                    message="Are you sure you want to delete this funeral record? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    itemName={deleteTarget?.name || ''}
                />
            </div>
        )
    }

    function AppContent(){
        return(
            <InventoryProvider>
                <FuneralsProvider>
                    <FuneralContent />
                </FuneralsProvider>
            </InventoryProvider>
        );
    }
    
    return(
        <ProtectedRoute>
            <AppContent />
        </ProtectedRoute>
    )
}