"use client";

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

interface SessionWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtend: () => void;
  expiresIn: number;
}

const SessionWarningModal: React.FC<SessionWarningModalProps> = ({ 
  isOpen, 
  onClose, 
  onExtend, 
  expiresIn 
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(expiresIn / 60);
  const seconds = expiresIn % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-yellow-500 text-6xl mb-4">⏰</div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Session Expiring Soon
          </h2>
          <p className="text-gray-600 mb-6">
            Your session will expire in <strong>{minutes}:{seconds.toString().padStart(2, '0')}</strong>.
            You&apos;ll be automatically logged out to protect your data.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onExtend}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Stay Logged In
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
            >
              Continue Working
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Please save any unsaved work
          </p>
        </div>
      </div>
    </div>
  );
};

interface SessionToastProps {
  isVisible: boolean;
  message: string;
  type: 'warning' | 'info' | 'error';
  onClose: () => void;
}

const SessionToast: React.FC<SessionToastProps> = ({ isVisible, message, type, onClose }) => {
  if (!isVisible) return null;

  const bgColor = {
    warning: 'bg-yellow-500',
    info: 'bg-blue-500', 
    error: 'bg-red-500'
  }[type];

  const icon = {
    warning: '⚠️',
    info: 'ℹ️',
    error: '❌'
  }[type];

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-40 max-w-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2">{icon}</span>
          <span className="text-sm">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const SessionManager: React.FC = () => {
  const { getValidToken, logout, isAuthenticated } = useAuthContext();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'warning' | 'info' | 'error'>('info');
  const [timeUntilExpiry, setTimeUntilExpiry] = useState(0);

  // Function to decode token and get expiry time
  const getTokenExpiry = (token: string): number | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      return decoded.exp;
    } catch (error) {
      return null;
    }
  };

  const showToastNotification = (message: string, type: 'warning' | 'info' | 'error' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleExtendSession = () => {
    setShowWarningModal(false);
    showToastNotification('Session extended. Please save your work regularly.', 'info');
    
    // In a real app, you might refresh the token here
    // For now, we'll just dismiss the modal
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSessionExpiry = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const expiry = getTokenExpiry(token);
      if (!expiry) return;

      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = expiry - currentTime;
      setTimeUntilExpiry(timeLeft);

      // Show warning modal if less than 5 minutes remaining
      if (timeLeft <= 300 && timeLeft > 0 && !showWarningModal) {
        setShowWarningModal(true);
      }

      // Auto-logout if expired
      if (timeLeft <= 0) {
        logout('Your session has expired');
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkSessionExpiry, 30000);
    
    // Check immediately
    checkSessionExpiry();

    return () => clearInterval(interval);
  }, [isAuthenticated, logout, showWarningModal]);

  // Update countdown timer for modal
  useEffect(() => {
    if (!showWarningModal) return;

    const timer = setInterval(() => {
      setTimeUntilExpiry(prev => {
        if (prev <= 1) {
          setShowWarningModal(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarningModal]);

  return (
    <>
      <SessionWarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onExtend={handleExtendSession}
        expiresIn={timeUntilExpiry}
      />
      
      <SessionToast
        isVisible={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default SessionManager;