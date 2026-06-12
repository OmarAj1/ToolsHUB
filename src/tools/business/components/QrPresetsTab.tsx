import React from 'react';

export function QrPresetsTab({ handlers }: any) {
  const { applyPreset } = handlers;

  return (
     <div className="grid grid-cols-2 md:grid-cols-3 gap-5 animate-in fade-in zoom-in-95 duration-400">
       <button onClick={() => applyPreset('standard')} className="px-6 py-8 bg-[#FAFAFA] dark:bg-[#1A1A1A] rounded-[2rem] font-extrabold border-[2px] border-slate-100 dark:border-[#2A2A2A] hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 text-sm tracking-wide">Standard</button>
       <button onClick={() => applyPreset('ocean')} className="px-6 py-8 rounded-[2rem] font-extrabold text-white shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all border-0 text-sm tracking-wide relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #2193b0, #6dd5ed)' }}>
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />Ocean
       </button>
       <button onClick={() => applyPreset('sunset')} className="px-6 py-8 rounded-[2rem] font-extrabold text-white shadow-lg hover:shadow-2xl hover:shadow-orange-500/30 hover:-translate-y-1 transition-all border-0 text-sm tracking-wide relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }}>
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />Sunset
       </button>
       <button onClick={() => applyPreset('cyberpunk')} className="px-6 py-8 rounded-[2rem] font-extrabold text-white shadow-lg hover:shadow-2xl hover:shadow-pink-500/30 hover:-translate-y-1 transition-all border-0 text-sm tracking-wide relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #f953c6, #0f0c29)' }}>
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />Cyberpunk
       </button>
       <button onClick={() => applyPreset('leafy')} className="px-6 py-8 rounded-[2rem] font-extrabold text-white shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all border-0 text-sm tracking-wide relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}>
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />Forest
       </button>
       <button onClick={() => applyPreset('cosmic')} className="px-6 py-8 rounded-[2rem] font-extrabold text-white shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-1 transition-all border-0 text-sm tracking-wide relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #8A2387, #E94057)' }}>
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />Cosmic
       </button>
     </div>
  );
}
