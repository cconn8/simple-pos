// Invoice Page.js renders the Invoice Component on the Invoice page

'use client';
import { useEffect, useState } from 'react';
import Invoice from '../../components/Invoice/Invoice.jsx';

export default function InvoicePage() {
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('invoiceData');
    if (stored) {
      setInvoiceData(JSON.parse(stored));

        //clear local storage after use
        localStorage.removeItem('invoiceData');
    }
  }, []);

  if (!invoiceData) return <p>Loading invoice...</p>;

  return <Invoice formData={invoiceData.formData} />;
}
