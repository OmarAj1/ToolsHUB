import React, { useState, useEffect } from 'react';

export function CpmCalculator() {
  const [impressions, setImpressions] = useState(100000);
  const [cost, setCost] = useState(500);
  const [cpm, setCpm] = useState(5);
  const [lastEdited, setLastEdited] = useState<'impressions' | 'cost' | 'cpm'>('cost');

  useEffect(() => {
    if (lastEdited === 'impressions') {
      if (cpm > 0 && impressions > 0) setCost((impressions / 1000) * cpm);
    } else if (lastEdited === 'cost') {
      if (impressions > 0) setCpm((cost / impressions) * 1000);
    } else if (lastEdited === 'cpm') {
      if (cpm > 0) setImpressions((cost / cpm) * 1000);
    }
  }, [impressions, cost, cpm, lastEdited]);

  return (
    <div className="max-w-2xl mx-auto p-6 text-slate-50 text-slate-50">
      <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-2xl p-8 shadow-sm">
         <div className="text-center mb-8 text-sm text-slate-400">
           Fill out two fields to automatically calculate the third.
         </div>

         <div className="space-y-6">
           <div>
             <label className="block text-sm font-bold mb-2">Total Campaign Cost ($)</label>
             <input 
               type="number" 
               value={cost} 
               onChange={(e) => {
                 setCost(Number(e.target.value));
                 setLastEdited('cost');
               }} 
               min="0"
               className="w-full text-2xl font-bold bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
           </div>

           <div className="grid grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-bold mb-2">Total Impressions</label>
               <input 
                 type="number" 
                 value={impressions} 
                 onChange={(e) => {
                   setImpressions(Number(e.target.value));
                   setLastEdited('impressions');
                 }} 
                 min="0"
                 className="w-full text-xl font-bold bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>
             
             <div>
               <label className="block text-sm font-bold mb-2 text-blue-600 text-blue-400">CPM ($ per 1,000)</label>
               <input 
                 type="number" 
                 value={cpm} 
                 onChange={(e) => {
                   setCpm(Number(e.target.value));
                   setLastEdited('cpm');
                 }} 
                 min="0" step="0.01"
                 className="w-full text-xl font-bold text-blue-600 text-blue-400 bg-blue-50 bg-blue-900/20 border border-blue-200 border-blue-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>
           </div>
         </div>

         <div className="mt-8 pt-8 border-t border-slate-700 border-slate-700 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">Cost / Click (1% CTR)</div>
              <div className="font-mono">${((cpm / 1000) / 0.01).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">Cost / Click (2% CTR)</div>
              <div className="font-mono">${((cpm / 1000) / 0.02).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">Cost / Click (5% CTR)</div>
              <div className="font-mono">${((cpm / 1000) / 0.05).toFixed(2)}</div>
            </div>
         </div>
      </div>
    </div>
  );
}
