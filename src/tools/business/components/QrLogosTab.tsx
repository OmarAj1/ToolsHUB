import React from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

export function QrLogosTab({ state, setters, handlers }: any) {
  const { logoImage, logoMargin } = state;
  const { setLogoImage, setLogoMargin } = setters;
  const { handleLogoUpload } = handlers;

  return (
     <div className="max-w-2xl animate-in fade-in duration-300">
       <div className="flex flex-col sm:flex-row gap-6 items-start">
         {!logoImage ? (
           <label className="flex flex-col items-center justify-center w-full sm:w-40 h-40 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#161616] rounded-3xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-[#1A1A1A] cursor-pointer transition-all hover:shadow-md">
             <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-3">
               <ImageIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
             </div>
             <span className="text-xs text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest">Upload Logo</span>
             <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
           </label>
         ) : (
           <div className="relative w-full sm:w-40 h-40 border border-slate-200 dark:border-[#2A2A2A] rounded-3xl overflow-hidden bg-white dark:bg-[#111111] flex items-center justify-center p-4 group shadow-sm">
             <img src={logoImage} alt="Logo" className="max-w-full max-h-full object-contain" />
             <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => setLogoImage(null)} className="bg-white text-slate-900 p-3 rounded-full mb-2 hover:bg-red-500 hover:text-white transition-colors shadow-lg">
                 <X className="w-6 h-6" />
               </button>
             </div>
           </div>
         )}

         {logoImage && (
           <div className="flex-1 w-full bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-slate-100 dark:border-[#2A2A2A] p-6 rounded-3xl shadow-sm">
             <label className="flex justify-between items-center text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-5 tracking-wider">
               <span>Logo Edge Margin</span>
               <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-[#111111] px-3 py-1 rounded-full">{logoMargin}px</span>
             </label>
             <input type="range" min="0" max="40" value={logoMargin} onChange={e => setLogoMargin(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
             <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium">Adjust margin to cut a clear hole around your logo, ensuring that the QR matrix doesn't overlap and break scannability.</p>
           </div>
         )}
       </div>
     </div>
  );
}
