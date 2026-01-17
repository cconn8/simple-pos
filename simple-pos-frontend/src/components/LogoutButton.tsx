"use client";

import React from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

interface LogoutButtonProps {
  className?: string;
  showIcon?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors",
  showIcon = true 
}) => {
  const { logout, isAuthenticated, user } = useAuthContext();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    const confirmed = confirm('Are you sure you want to logout?');
    if (confirmed) {
      logout('User initiated logout');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={className}
      title={`Logout ${user?.email || 'current user'}`}
    >
      {showIcon && <span className="mr-2">🚪</span>}
      Logout
    </button>
  );
};

export default LogoutButton;