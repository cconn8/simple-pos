"use client";

import React, { useState } from 'react';
import { X } from '@deemlol/next-icons';
import { PaymentStatus } from '@/types';

interface PaymentCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  deceasedName: string;
  newPaymentStatus: PaymentStatus;
  currentPaymentStatus: PaymentStatus;
}

/**
 * PaymentCommentModal - Simple modal for adding payment comments
 * 
 * TEACHING MOMENT:
 * This modal follows the same pattern as XeroPostingModal but is much simpler.
 * It has:
 * 1. A comment text area (optional)
 * 2. Skip button (proceeds without comment)
 * 3. Confirm button (proceeds with comment)
 * 
 * The modal automatically opens when payment status changes to Paid or Partially Paid
 */
export default function PaymentCommentModal({
  isOpen,
  onClose,
  onConfirm,
  deceasedName,
  newPaymentStatus,
  currentPaymentStatus
}: PaymentCommentModalProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission with comment
  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(comment);
      // Close modal and reset form
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error submitting payment comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle skip (no comment)
  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(''); // Send empty comment
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error updating payment status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      setComment('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Payment Comment
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status change summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              Marking Payment for: {deceasedName}
            </h3>
            <p className="text-sm text-gray-600">
              Status: <span className="font-medium">{currentPaymentStatus}</span> → <span className="font-medium text-blue-600">{newPaymentStatus}</span>
            </p>
          </div>

          {/* Comment input */}
          <div>
            <label htmlFor="payment-comment" className="block text-sm font-medium text-gray-700 mb-2">
              Leave a comment about this payment (optional)
            </label>
            <textarea
              id="payment-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g., Received cash payment, Bank transfer confirmed, Partial payment - balance pending..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be saved to the Payment History section
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Skip Comment'}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                🔄 Updating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                ✅ Confirm Payment
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}