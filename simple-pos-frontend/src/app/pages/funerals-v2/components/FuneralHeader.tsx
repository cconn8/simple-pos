"use client";

import { useFuneralsContext } from "@/contexts/FuneralsContext";
import { useState, useEffect } from "react";


export default function FuneralHeader() {
    const {showFuneralModal, setShowFuneralModal} = useFuneralsContext();
    const [xeroConnected, setXeroConnected] = useState(false);
    const [checkingXero, setCheckingXero] = useState(true);

    useEffect(() => {
        checkXeroStatus();
        
        // Check for OAuth success in URL and re-check status
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('xero_auth') === 'success') {
            console.log('🎉 Xero OAuth success detected - rechecking status');
            setTimeout(() => {
                checkXeroStatus();
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 1000);
        }
    }, []);

    const checkXeroStatus = async () => {
        console.log('🔍 Checking Xero connection status...');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('❌ No auth token found');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/xero/status`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const result = await response.json();
            setXeroConnected(result.authenticated);
            console.log(`✅ Xero status: ${result.authenticated ? 'Connected' : 'Not connected'}`);
        } catch (error) {
            console.error('❌ Failed to check Xero status:', error);
        } finally {
            setCheckingXero(false);
        }
    };

    const connectToXero = () => {
        console.log('🚀 Opening Xero connection window...');
        const xeroWindow = window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/xero/connect`, '_blank');
        
        // Check for window close to re-check status
        const checkClosed = setInterval(() => {
            if (xeroWindow?.closed) {
                console.log('🔄 Xero auth window closed - rechecking status');
                clearInterval(checkClosed);
                setTimeout(() => {
                    checkXeroStatus();
                }, 2000);
            }
        }, 1000);
    };

    return(
        <div className="flex flex-row p-2 w-full h-20 bg-gray-50 rounded-sm items-center justify-between border border-gray-200">
            <h1 className="font-bold">Funerals</h1>
            <div className="flex gap-2">
                {!checkingXero && !xeroConnected && (
                    <button 
                        onClick={connectToXero}
                        className="p-2 border-1 border-gray-300 rounded-sm bg-green-600 text-white hover:bg-green-700">
                        Connect to Xero
                    </button>
                )}
                {xeroConnected && (
                    <button 
                        onClick={() => checkXeroStatus()}
                        className="p-2 text-green-700 font-medium hover:bg-green-50 rounded">
                        ✓ Xero Connected
                    </button>
                )}
                {process.env.NODE_ENV === 'development' && (
                    <button 
                        onClick={() => checkXeroStatus()}
                        className="p-1 text-xs bg-gray-200 hover:bg-gray-300 rounded">
                        🔄 Check Status
                    </button>
                )}
                <button 
                    onClick={() => {
                        setShowFuneralModal(true)}}
                    className="p-2 border-1 border-gray-300 rounded-sm bg-blue-600 text-white hover:bg-blue-700">+ Create Funeral</button>
            </div>
        </div>
        
    )
}