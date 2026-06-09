import React, { useState } from "react";
import { Crosshair, Mouse, Settings2, TrendingUp, Monitor } from "lucide-react";

export function KdCalculator() {
  const [kills, setKills] = useState<number | "">("");
  const [deaths, setDeaths] = useState<number | "">("");
  const [assists, setAssists] = useState<number | "">("");

  const k = Number(kills) || 0;
  const d = Number(deaths) || 0;
  const a = Number(assists) || 0;

  const kd = d > 0 ? (k / d).toFixed(2) : k > 0 ? "Perfect" : "0.00";
  const kda = d > 0 ? ((k + a) / d).toFixed(2) : k + a > 0 ? "Perfect" : "0.00";

  return (
    <div className="p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 transition-colors">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Crosshair className="w-6 h-6 text-indigo-500" /> K/D Ratio Calculator</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Kills</label>
             <input type="number" value={kills} onChange={e => setKills(e.target.value === "" ? "" : Number(e.target.value))} className="w-full mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white" placeholder="0" />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Deaths</label>
             <input type="number" value={deaths} onChange={e => setDeaths(e.target.value === "" ? "" : Number(e.target.value))} className="w-full mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white" placeholder="0" />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Assists</label>
             <input type="number" value={assists} onChange={e => setAssists(e.target.value === "" ? "" : Number(e.target.value))} className="w-full mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white" placeholder="0" />
           </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-indigo-600 text-white rounded-2xl p-6 text-center">
              <span className="opacity-80 text-sm font-medium">K/D Ratio</span>
              <div className="text-4xl font-black mt-2">{kd}</div>
           </div>
           <div className="bg-emerald-600 text-white rounded-2xl p-6 text-center">
              <span className="opacity-80 text-sm font-medium">KDA Ratio</span>
              <div className="text-4xl font-black mt-2">{kda}</div>
           </div>
        </div>
      </div>
    </div>
  );
}

export function EdpiCalculator() {
  const [dpi, setDpi] = useState<number | "">("");
  const [sens, setSens] = useState<number | "">("");

  const d = Number(dpi) || 0;
  const s = Number(sens) || 0;
  const edpi = d * s;

  return (
    <div className="p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 transition-colors">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Mouse className="w-6 h-6 text-indigo-500" /> eDPI Calculator</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Mouse DPI</label>
             <input type="number" value={dpi} onChange={e => setDpi(e.target.value === "" ? "" : Number(e.target.value))} className="w-full mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white" placeholder="800" />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase">In-Game Sensitivity</label>
             <input type="number" step="0.01" value={sens} onChange={e => setSens(e.target.value === "" ? "" : Number(e.target.value))} className="w-full mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white" placeholder="1.5" />
           </div>
        </div>
        <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-6 text-center shadow-xl">
           <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Effective DPI (eDPI)</span>
           <div className="text-5xl font-black mt-3">{edpi.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

// Just placeholders for the rest
export function SensConverter() { return <div className="p-12 text-center text-slate-500 font-medium">Sensitivity Converter coming soon!</div>; }
export function XpCalculator() { return <div className="p-12 text-center text-slate-500 font-medium">XP Goal Calculator coming soon!</div>; }
export function AspectRatioCalc() { return <div className="p-12 text-center text-slate-500 font-medium">Aspect Ratio Calculator coming soon!</div>; }

