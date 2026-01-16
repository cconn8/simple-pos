"use client";

import { InventoryProvider } from '@/contexts/InventoryContext';
import FuneralHeader from './components/FuneralHeader';
import FuneralTable from './components/FuneralTable';
import CreateFuneralModal from './modals/CreateFuneralModal';
import { FuneralsProvider } from '@/contexts/FuneralsContext';
import { EditFuneralItemModal } from './modals/EditFuneralItemModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { FuneralDetailDrawer } from './components/FuneralDetailDrawer';
import XeroPostingModal, { XeroPostingData } from './modals/XeroPostingModal';
import { useFuneralsContext } from '@/contexts/FuneralsContext';
import { useFunerals } from '@/hooks/useApi';
import { useFuneralsV2 } from '@/hooks/useFuneralsV2';
import ProtectedRoute from '@/components/ProtectedRoute';



export default function FuneralsPage() {
        
    
    function FuneralContent(){
        const { 
            showDeleteModal, 
            setShowDeleteModal, 
            deleteTarget, 
            setDeleteTarget,
            showXeroPostingModal,
            setShowXeroPostingModal,
            xeroPostingFuneral,
            setXeroPostingFuneral
        } = useFuneralsContext();
        
        const { deleteFuneral } = useFunerals();
        const { fetchFunerals } = useFuneralsV2();

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

        const handleXeroPosting = async (postingData: XeroPostingData) => {
            try {
                console.log('💼 Starting Xero posting for funeral:', postingData.funeralId);
                
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('❌ No auth token found');
                    alert('❌ Authentication required. Please log in again.');
                    return;
                }
                
                // Call the backend XERO API
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funerals/${postingData.funeralId}/xero/post`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(postingData),
                });

                const result = await response.json();
                console.log('📊 Xero posting response:', result.success ? '✅ Success' : '❌ Failed');

                if (result.success) {
                    const contactMessage = result.xeroData.contactStatus === 'existing' 
                        ? `Contact: Found existing "${result.xeroData.contactName}" in XERO`
                        : `Contact: Created new "${result.xeroData.contactName}" in XERO`;
                    
                    alert(`✅ Successfully posted to XERO!\n\n${contactMessage}\nContact ID: ${result.xeroData.contactId}\nInvoice ID: ${result.xeroData.invoiceId}\n\nClick the "✅ Posted to XERO" status to open XERO invoices page.`);
                    
                    // Refresh the funeral data to show updated XERO status
                    await fetchFunerals();
                    
                } else if (result.isDuplicateInvoice) {
                    // Handle duplicate invoice case - show user options
                    const userChoice = confirm(`⚠️ Duplicate Invoice Detected\n\nInvoice #${result.duplicateInvoiceNumber} already exists in XERO.\n\nClick OK to mark this funeral as posted to the existing XERO invoice.\nClick Cancel to go back and change the invoice number.`);
                    
                    if (userChoice) {
                        // User chose to mark as posted to existing invoice
                        try {
                            const markPostedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funerals/${postingData.funeralId}/xero/mark-posted`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify(postingData),
                            });

                            const markPostedResult = await markPostedResponse.json();
                            
                            if (markPostedResult.success) {
                                alert(`✅ Successfully marked as posted to existing XERO invoice!\n\nInvoice #${result.duplicateInvoiceNumber} is now linked to this funeral record.`);
                                await fetchFunerals();
                            } else {
                                alert(`❌ Failed to mark as posted!\n\nError: ${markPostedResult.error}`);
                            }
                            
                        } catch (markError) {
                            console.error('Mark as posted error:', markError);
                            alert('❌ Network error while marking as posted. Please try again.');
                        }
                    }
                    // If user cancels, they can modify the invoice number and try again
                    
                } else {
                    alert(`❌ XERO posting failed!\n\nError: ${result.error}`);
                }
                
            } catch (error) {
                console.error('XERO posting error:', error);
                alert('❌ Network error during XERO posting. Please check your connection and try again.');
            }
            
            // Close modal and reset state
            setShowXeroPostingModal(false);
            setXeroPostingFuneral(null);
        };

        const handleXeroPostingCancel = () => {
            setShowXeroPostingModal(false);
            setXeroPostingFuneral(null);
        };

        return(
            <div className='flex flex-col w-full'>
                <FuneralHeader />
                <FuneralTable />
                <CreateFuneralModal />
                <EditFuneralItemModal />
                <FuneralDetailDrawer />
                
                {/* XERO Posting Modal */}
                <XeroPostingModal
                    isOpen={showXeroPostingModal}
                    onClose={handleXeroPostingCancel}
                    funeral={xeroPostingFuneral}
                    onConfirmPost={handleXeroPosting}
                />
                
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