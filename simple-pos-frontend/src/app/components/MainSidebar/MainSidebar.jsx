"use client"

import { useRouter } from "next/navigation";

export default function MainSidebar() {

    const router = useRouter();

    return (
        <aside id="mainSidebarContainer" className="top-0 sticky basis-1/8 bg-gray-500 m-1 rounded-sm">
            <div id="sidebarLogo" className="p-2 justify-center">
                <img src="/offd-logo.png" width="75" height="50"></img>
            </div>
            
            <div id="mainMenu" className="py-5">
                <div className="m-2 p-1 text-gray-300 border-b border-gray hover:text-white hover:border-white hover:font-bold transition-all duration-300 rounded-sm"><button onClick={() => {router.push('./funerals')}}>Funerals</button></div>
                <div className="m-2 p-1 text-gray-300 border-b border-gray hover:text-white hover:border-white hover:font-bold transition-all duration-300 rounded-sm"><button onClick={() => {router.push('./inventory')}}>Inventory</button></div>
                <div className="m-2 p-1 text-gray-300 border-b border-gray hover:text-white hover:border-white hover:font-bold transition-all duration-300 rounded-sm"><button>Invoices</button></div>
            </div>
        </aside>
    )
}