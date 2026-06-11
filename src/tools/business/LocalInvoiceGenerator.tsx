import React, { useState, useRef } from 'react';
import { Download, Plus, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';

export function LocalInvoiceGenerator() {
  const [invoiceId, setInvoiceId] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [from, setFrom] = useState('My Company LLC\n123 Business Rd.\nCity, ST 12345');
  const [to, setTo] = useState('Client Name\n456 Client Ave.\nCity, ST 54321');
  const [items, setItems] = useState([
    { id: 1, desc: 'Web Development Services', qty: 1, price: 1500 },
    { id: 2, desc: 'Hosting & Maintenance', qty: 1, price: 150 }
  ]);
  const [currency, setCurrency] = useState('$');
  const [isGenerating, setIsGenerating] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const addItem = () => setItems([...items, { id: Date.now(), desc: '', qty: 1, price: 0 }]);
  const updateItem = (id: number, field: string, val: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: val } : i));
  };
  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));

  const total = items.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);

  const printDocument = async () => {
    if (!invoiceRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toJpeg(invoiceRef.current, {
        quality: 1,
        backgroundColor: '#ffffff',
        pixelRatio: 2 // High resolution
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (invoiceRef.current.offsetHeight * pdfWidth) / invoiceRef.current.offsetWidth;
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${invoiceId}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      console.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 text-slate-800 dark:text-slate-200">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <strong>Privacy:</strong> No data is saved to a server. PDF is generated locally in your browser.
        </div>
        <button 
          onClick={printDocument}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      <div className="overflow-x-auto pb-8">
        {/* Wrapper handles the decorative shadow so the PDF canvas doesn't parse oklch */}
        <div className="shadow-lg mx-auto w-[816px] print:shadow-none print:w-auto print:m-0">
          <div 
            ref={invoiceRef}
            style={{ backgroundColor: '#ffffff', color: '#1e293b' }}
            className="relative flex flex-col p-8 sm:p-16 min-h-[1056px] w-full print:p-0"
          >
          
          {/* Header */}
        <div style={{ borderBottom: '2px solid #f1f5f9' }} className="flex justify-between pb-8 mb-8">
           <div>
             <h1 style={{ color: '#4f46e5' }} className="text-4xl font-black uppercase tracking-widest mb-2 font-mono">Invoice</h1>
             <div style={{ color: '#64748b' }} className="flex items-center gap-2 font-mono">
               <strong>No.</strong> 
               <input type="text" value={invoiceId} onChange={e=>setInvoiceId(e.target.value)} style={{ borderColor: '#cbd5e1' }} className="bg-transparent border-b border-dashed focus:outline-none w-32" />
             </div>
             <div style={{ color: '#64748b' }} className="flex items-center gap-2 font-mono mt-1">
               <strong>Date</strong> 
               <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ borderColor: '#cbd5e1' }} className="bg-transparent border-b border-dashed focus:outline-none" />
             </div>
           </div>
           <div className="text-right">
              <label style={{ color: '#94a3b8' }} className="block text-xs font-bold uppercase mb-1">From</label>
              <textarea value={from} onChange={e=>setFrom(e.target.value)} style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }} className="border rounded p-2 text-right w-64 h-24 text-sm focus:outline-none resize-none" />
           </div>
        </div>

        {/* Bill To */}
        <div className="mb-10">
           <label style={{ color: '#94a3b8' }} className="block text-xs font-bold uppercase mb-1">Bill To</label>
           <textarea value={to} onChange={e=>setTo(e.target.value)} style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }} className="border rounded p-2 w-64 h-24 text-sm focus:outline-none resize-none" />
        </div>

        {/* Items Table */}
        <div className="mb-8">
           <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderColor: '#e2e8f0', color: '#64748b' }} className="border-b-2 text-sm uppercase tracking-wider">
                  <th className="py-3 px-2 w-[50%]">Description</th>
                  <th className="py-3 px-2 text-center w-24">Qty</th>
                  <th className="py-3 px-2 text-right w-32">Price ({currency})</th>
                  <th className="py-3 px-2 text-right w-32">Amount</th>
                  <th className="py-3 px-2 w-8 print:hidden"></th>
                </tr>
              </thead>
              <tbody>
                 {items.map((item, idx) => (
                   <tr key={item.id} style={{ borderColor: '#f1f5f9' }} className="border-b group">
                     <td className="py-2 px-2">
                       <input type="text" value={item.desc} onChange={e => updateItem(item.id, 'desc', e.target.value)} placeholder="Item description" className="w-full bg-transparent p-1 border border-transparent focus:outline-none text-sm" />
                     </td>
                     <td className="py-2 px-2">
                       <input type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} min="1" className="w-full bg-transparent p-1 border border-transparent focus:outline-none text-sm text-center font-mono" />
                     </td>
                     <td className="py-2 px-2">
                       <input type="number" value={item.price} onChange={e => updateItem(item.id, 'price', Number(e.target.value))} min="0" step="0.01" className="w-full bg-transparent p-1 border border-transparent focus:outline-none text-sm text-right font-mono" />
                     </td>
                     <td className="py-2 px-2 text-right font-mono text-sm font-bold opacity-80">
                       {currency}{(item.qty * item.price).toFixed(2)}
                     </td>
                     <td className="py-2 px-2 print:hidden">
                       <button onClick={() => removeItem(item.id)} style={{ color: '#fca5a5' }} className="transition-colors opacity-0 group-hover:opacity-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                     </td>
                   </tr>
                 ))}
                 <tr className="print:hidden">
                   <td colSpan={5} className="py-3">
                     <button onClick={addItem} style={{ color: '#4f46e5' }} className="flex items-center gap-1 text-xs font-bold px-2 py-1 transition-colors">
                       <Plus className="w-3 h-3" /> Add Item
                     </button>
                   </td>
                 </tr>
              </tbody>
           </table>
        </div>

        <div style={{ borderColor: '#e2e8f0' }} className="flex justify-end border-t-2 pt-6 mt-auto">
           <div className="w-64">
              <div className="flex justify-between items-center mb-2 font-bold text-xl">
                 <span style={{ color: '#64748b' }} className="uppercase text-sm">Total Due</span>
                 <span style={{ color: '#4f46e5' }} className="font-mono">{currency}{total.toFixed(2)}</span>
              </div>
           </div>
        </div>

        {/* Global Print Styles to fix Dark Mode prints */}
        <style>{`
          @media print {
            body { background: white !important; color: black !important; }
            .print\\:hidden { display: none !important; }
            .bg-white { background: white !important; }
            * { text-shadow: none !important; box-shadow: none !important; }
          }
        `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}
