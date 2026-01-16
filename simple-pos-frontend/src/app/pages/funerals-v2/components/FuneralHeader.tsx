"use client";

import { useFuneralsContext } from "@/contexts/FuneralsContext";
import { useState, useEffect } from "react";


export default function FuneralHeader() {
    const {showFuneralModal, setShowFuneralModal} = useFuneralsContext();
    const [xeroConnected, setXeroConnected] = useState(false);
    const [checkingXero, setCheckingXero] = useState(true);

    useEffect(() => {
        checkXeroStatus();
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
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/xero/connect`, '_blank');
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
                    <span className="p-2 text-green-700 font-medium">✓ Xero Connected</span>
                )}
                <button 
                    onClick={() => {
                        setShowFuneralModal(true)}}
                    className="p-2 border-1 border-gray-300 rounded-sm bg-blue-600 text-white hover:bg-blue-700">+ Create Funeral</button>
            </div>
        </div>
        
    )
}