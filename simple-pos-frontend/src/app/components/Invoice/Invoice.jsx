
export default function Invoice() {

    return (
        <div id="invoice-container">
            <div id="first-invoice-details-section" class="border flex flex-row justify-around">
                <div id="client-details-div" className="border flex flex-col p-4 m-4"> 
                        <div id='representatives-div' className="border p-4 m-2">Representatives of the late 'Deceased Name'</div>
                        <div id='care-of-div' className="border p-4 m-2">C/O James Murphy</div>
                        <div id='client-address-div' className="border p-4 m-2">Client address</div>
                        <div id='client-address-div' className="border p-4 m-2">Client address</div>

                </div> 
                <div id="logo-and-invNumber-div" className="border flex flex-col p-4 m-4">
                    <div id="logo-div" className="border p-8 m-2">LOGO</div>
                    <div id="inv-number-div" className="border p-4 m-2">Invoice Number: 23492</div>
                    <div id="inv-date-div" className="border p-4 m-2">Invoice Date: 23 April 2025</div>
                </div>
            </div>
        </div>
    )
}