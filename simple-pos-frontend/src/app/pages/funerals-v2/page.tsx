import { InventoryProvider } from '@/contexts/InventoryContext';
import FuneralHeader from './components/FuneralHeader';
import FuneralTable from './components/FuneralTable';
import CreateFuneralModal from './modals/CreateFuneralModal';
import { FuneralsProvider } from '@/contexts/FuneralsContext';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { useFuneralsContext } from '@/contexts/FuneralsContext';
import { useFunerals } from '@/hooks/useApi';

function DeleteFuneralModal() {
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

    return (
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
    );
}

export default function FuneralsPage() {
        
    
    function FuneralContent(){
        return(
            <div className='flex flex-col w-full'>
                <FuneralHeader />
                <FuneralTable />
                <CreateFuneralModal />
                <DeleteFuneralModal />
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
    
    // Remove FuneralModalProvider once FuneralProvider is built properly
    return(
        <AppContent />
    )
}