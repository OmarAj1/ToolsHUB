import React from 'react';

export function QrColorsTab({ state, setters }: any) {
  const { size, dotsColor, bgColor } = state;
  const { setSize, setDotsColor, setGradient, setCornersColor, setBgColor } = setters;

  return (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl animate-in fade-in zoom-in-95 duration-400">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 text-slate-50 mb-3 ml-1">Resolution</label>
          <div className="flex bg-slate-800 bg-[#1A1A1A] rounded-3xl border border-slate-700 border-[#2A2A2A] overflow-hidden outline-none focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm">
             <div className="px-6 py-4 bg-slate-900 bg-[#111111] border-r border-slate-700 border-[#2A2A2A] text-sm font-bold text-slate-400 text-slate-50 min-w-[80px] text-center shrink-0 flex items-center justify-center">{size}px</div>
             <div className="flex-1 px-6 flex items-center relative py-4">
                <input type="range" min="100" max="2000" step="10" value={size} onChange={e => setSize(Number(e.target.value))} className="w-full h-2 bg-slate-800 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 relative z-10" />
             </div>
          </div>
        </div>
        
        <div className="bg-slate-900 bg-[#1A1A1A] p-6 rounded-[2rem] border border-slate-700 border-[#2A2A2A]">
           <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 text-slate-50 mb-3 ml-1">Foreground</label>
           <div className="flex bg-slate-800 bg-[#111111] rounded-2xl border border-slate-700 border-[#333] overflow-hidden outline-none focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm p-1">
             <input type="color" value={dotsColor} onChange={e => { setDotsColor(e.target.value); setGradient(null); setCornersColor(e.target.value); }} className="w-12 h-12 rounded-xl border-2 border-white border-[#111111] shadow-sm cursor-pointer p-0" style={{minWidth: "48px"}} />
             <input type="text" value={dotsColor} onChange={e => { setDotsColor(e.target.value); setGradient(null); setCornersColor(e.target.value); }} className="w-full bg-transparent px-4 text-sm font-bold uppercase tracking-wider outline-none text-slate-50 text-slate-50" />
           </div>
        </div>
        <div className="bg-slate-900 bg-[#1A1A1A] p-6 rounded-[2rem] border border-slate-700 border-[#2A2A2A]">
           <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 text-slate-50 mb-3 ml-1">Background</label>
           <div className="flex bg-slate-800 bg-[#111111] rounded-2xl border border-slate-700 border-[#333] overflow-hidden outline-none focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm p-1">
             <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-12 h-12 rounded-xl border-2 border-white border-[#111111] shadow-sm cursor-pointer p-0" style={{minWidth: "48px"}} />
             <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full bg-transparent px-4 text-sm font-bold uppercase tracking-wider outline-none text-slate-50 text-slate-50" />
           </div>
        </div>
     </div>
  );
}
