"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationItem {
  label: string;
  path?: string;
  disabled?: boolean;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Funerals', path: './funerals' },
  { label: 'Inventory', path: './inventory' },
  { label: 'Invoices', disabled: true },
];

export default function MainSidebar() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  return (
    <aside className="sticky top-0 basis-1/8 bg-gray-500 m-1 rounded-sm" role="navigation">
      <div className="flex justify-center p-2">
        <Image 
          src="/offd-logo.png" 
          alt="OFFD Logo" 
          width={75} 
          height={50}
          className="object-contain"
        />
      </div>
      
      <nav className="py-5" role="menubar">
        {NAVIGATION_ITEMS.map((item) => (
          <div key={item.label} className="m-2 p-1 text-gray-300 border-b border-gray hover:text-white hover:border-white hover:font-bold transition-all duration-300 rounded-sm">
            <button
              onClick={() => item.path && handleNavigation(item.path)}
              disabled={item.disabled}
              className="w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
              role="menuitem"
            >
              {item.label}
            </button>
          </div>
        ))}
        
        {/* Logout Button */}
        <div className="m-2 p-1 text-red-300 border-b border-red-400 hover:text-red-100 hover:border-red-200 hover:font-bold transition-all duration-300 rounded-sm">
          <button
            onClick={handleLogout}
            className="w-full text-left"
            role="menuitem"
          >
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}