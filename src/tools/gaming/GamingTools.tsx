import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import React, { useState } from "react";
import { Crosshair, Mouse, Settings2, TrendingUp, Monitor } from "lucide-react";

function KdCalculatorBase() {
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
      <div className="w-full max-w-2xl mx-auto bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded-3xl p-6 md:p-10 transition-colors">
        <h2 className="text-xl font-bold text-slate-50 text-white mb-6 flex items-center gap-2"><Crosshair className="w-6 h-6 text-blue-500" /> K/D Ratio Calculator</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
           <div>
             <label className="text-xs font-bold text-slate-400 uppercase">Kills</label>
             <input type="number" value={kills} onChange={e => setKills(e.target.value === "" ? "" : Number(e.target.value))} className="w-full mt-2 bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white" placeholder="0" />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-400 uppercase">Deaths</label>
             <input type="number" value={deaths} onChange={e => setDeaths(e.target.value === "" ? "" : Number(e.target.value))} className="w-full mt-2 bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white" placeholder="0" />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-400 uppercase">Assists</label>
             <input type="number" value={assists} onChange={e => setAssists(e.target.value === "" ? "" : Number(e.target.value))} className="w-full mt-2 bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white" placeholder="0" />
           </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-blue-500 text-white rounded-2xl p-6 text-center">
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

function EdpiCalculatorBase() {
  const [dpi, setDpi] = useState<number | "">("");
  const [sens, setSens] = useState<number | "">("");

  const d = Number(dpi) || 0;
  const s = Number(sens) || 0;
  const edpi = d * s;

  return (
    <div className="p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded-3xl p-6 md:p-10 transition-colors">
        <h2 className="text-xl font-bold text-slate-50 text-white mb-6 flex items-center gap-2"><Mouse className="w-6 h-6 text-blue-500" /> eDPI Calculator</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div>
             <label className="text-xs font-bold text-slate-400 uppercase">Mouse DPI</label>
             <input type="number" value={dpi} onChange={e => setDpi(e.target.value === "" ? "" : Number(e.target.value))} className="w-full mt-2 bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white" placeholder="800" />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-400 uppercase">In-Game Sensitivity</label>
             <input type="number" step="0.01" value={sens} onChange={e => setSens(e.target.value === "" ? "" : Number(e.target.value))} className="w-full mt-2 bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white" placeholder="1.5" />
           </div>
        </div>
        <div className="bg-slate-900 bg-slate-900 text-white rounded-2xl p-6 text-center shadow-xl">
           <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Effective DPI (eDPI)</span>
           <div className="text-5xl font-black mt-3">{edpi.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

function SensConverterBase() {
  const [fromGame, setFromGame] = useState("valorant");
  const [toGame, setToGame] = useState("cs2");
  const [sens, setSens] = useState<number | "">("");

  // Common multipliers relative to Valorant (Valorant = 1)
  const multipliers: Record<string, number> = {
    "valorant": 1,
    "cs2": 3.181818,
    "apex": 3.181818,
    "overwatch2": 10.6,
    "rainbow6": 12.2,
    "fortnite": 0.126
  };

  const convert = () => {
    if (!sens) return "";
    const baseVal = Number(sens) / multipliers[fromGame];
    return (baseVal * multipliers[toGame]).toFixed(3);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded-3xl p-6 md:p-10 transition-colors">
        <h2 className="text-xl font-bold text-slate-50 text-white mb-6 flex items-center gap-2"><Settings2 className="w-6 h-6 text-blue-500" /> Sensitivity Converter</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Convert From</label>
            <select value={fromGame} onChange={e => setFromGame(e.target.value)} className="w-full bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white">
              <option value="valorant">Valorant</option>
              <option value="cs2">CS:GO / CS2</option>
              <option value="apex">Apex Legends</option>
              <option value="overwatch2">Overwatch 2</option>
              <option value="rainbow6">Rainbow Six Siege</option>
              <option value="fortnite">Fortnite</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Convert To</label>
             <select value={toGame} onChange={e => setToGame(e.target.value)} className="w-full bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white">
              <option value="cs2">CS:GO / CS2</option>
              <option value="valorant">Valorant</option>
              <option value="apex">Apex Legends</option>
              <option value="overwatch2">Overwatch 2</option>
              <option value="rainbow6">Rainbow Six Siege</option>
              <option value="fortnite">Fortnite</option>
            </select>
          </div>
        </div>
        
        <div className="mb-8">
           <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Original Sensitivity</label>
           <input type="number" step="0.01" value={sens} onChange={e => setSens(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-4 text-center font-mono text-xl text-slate-50 text-white" placeholder="1.0" />
        </div>

        <div className="bg-blue-500 text-white rounded-2xl p-6 text-center shadow-xl">
           <span className="opacity-80 text-sm font-bold uppercase tracking-wider">Converted Sensitivity</span>
           <div className="text-5xl font-black mt-3 font-mono">{convert() || "0.000"}</div>
        </div>
      </div>
    </div>
  );
}

function XpCalculatorBase() {
  const [current, setCurrent] = useState<number | "">("");
  const [target, setTarget] = useState<number | "">("");
  const [xpPerLevel, setXpPerLevel] = useState<number | "">("");
  const [xpPerMatch, setXpPerMatch] = useState<number | "">("");

  const cl = Number(current) || 0;
  const tl = Number(target) || 0;
  const xl = Number(xpPerLevel) || 0;
  const xm = Number(xpPerMatch) || 0;

  const levelsToGain = Math.max(0, tl - cl);
  const totalXpNeeded = levelsToGain * xl;
  const matchesNeeded = xm > 0 ? Math.ceil(totalXpNeeded / xm) : 0;

  return (
    <div className="p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded-3xl p-6 md:p-10 transition-colors">
        <h2 className="text-xl font-bold text-slate-50 text-white mb-6 flex items-center gap-2"><TrendingUp className="w-6 h-6 text-blue-500" /> XP Goal Calculator</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Current Level</label>
            <input type="number" value={current} onChange={e => setCurrent(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white" placeholder="1" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Target Level</label>
            <input type="number" value={target} onChange={e => setTarget(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white" placeholder="100" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">XP Per Level</label>
            <input type="number" value={xpPerLevel} onChange={e => setXpPerLevel(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white" placeholder="10000" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Avg XP Per Match</label>
            <input type="number" value={xpPerMatch} onChange={e => setXpPerMatch(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white" placeholder="250" />
          </div>
        </div>

        <div className="bg-slate-900 bg-slate-900 text-white rounded-2xl p-6 text-center shadow-xl border border-slate-800">
           <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Estimated Matches Required</span>
           <div className="text-5xl font-black mt-3 text-blue-400">{matchesNeeded}</div>
           <div className="text-sm font-medium text-slate-400 mt-2">({totalXpNeeded.toLocaleString()} total XP needed)</div>
        </div>
      </div>
    </div>
  );
}

function AspectRatioCalcBase() {
  const [w1, setW1] = useState<number | "">(1920);
  const [h1, setH1] = useState<number | "">(1080);
  const [w2, setW2] = useState<number | "">("");
  const [h2, setH2] = useState<number | "">("");

  const updateH2 = (newW: number) => {
    if (w1 && h1) {
      setH2(Math.round((Number(h1) / Number(w1)) * newW));
    }
  };

  const updateW2 = (newH: number) => {
    if (w1 && h1) {
      setW2(Math.round((Number(w1) / Number(h1)) * newH));
    }
  };

  const calculateRatio = () => {
    if (!w1 || !h1) return "";
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const div = gcd(Number(w1), Number(h1));
    return `${Number(w1)/div}:${Number(h1)/div}`;
  };

  return (
    <div className="p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded-3xl p-6 md:p-10 transition-colors">
        <h2 className="text-xl font-bold text-slate-50 text-white mb-6 flex items-center gap-2"><Monitor className="w-6 h-6 text-blue-500" /> Aspect Ratio Calculator</h2>
        
        <div className="mb-4 text-center font-bold text-slate-50 text-white text-lg">
          Current Ratio: <span className="text-blue-500">{calculateRatio()}</span>
        </div>

        <div className="grid grid-cols-2 gap-8 items-center mb-8">
           <div className="space-y-4">
             <div>
               <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Base Width (W1)</label>
               <input type="number" value={w1} onChange={e => setW1(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white" />
             </div>
             <div>
               <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Base Height (H1)</label>
               <input type="number" value={h1} onChange={e => setH1(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl px-4 py-3 text-slate-50 text-white" />
             </div>
           </div>
           
           <div className="space-y-4">
             <div>
               <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Target Width (W2)</label>
               <input type="number" value={w2} onChange={e => {
                 const v = e.target.value === "" ? "" : Number(e.target.value);
                 setW2(v);
                 if (v !== "") updateH2(v);
               }} className="w-full bg-blue-50 bg-blue-900/10 border-2 border-blue-200 border-blue-800 rounded-xl px-4 py-3 text-blue-900 text-blue-300 font-bold" placeholder="Calculate..." />
             </div>
             <div>
               <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Target Height (H2)</label>
               <input type="number" value={h2} onChange={e => {
                 const v = e.target.value === "" ? "" : Number(e.target.value);
                 setH2(v);
                 if (v !== "") updateW2(v);
               }} className="w-full bg-blue-50 bg-blue-900/10 border-2 border-blue-200 border-blue-800 rounded-xl px-4 py-3 text-blue-900 text-blue-300 font-bold" placeholder="Calculate..." />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}


export const KdCalculator = () => <GenericToolWrapper toolName="KdCalculator"><KdCalculatorBase /></GenericToolWrapper>;

export const EdpiCalculator = () => <GenericToolWrapper toolName="EdpiCalculator"><EdpiCalculatorBase /></GenericToolWrapper>;

export const SensConverter = () => <GenericToolWrapper toolName="SensConverter"><SensConverterBase /></GenericToolWrapper>;

export const XpCalculator = () => <GenericToolWrapper toolName="XpCalculator"><XpCalculatorBase /></GenericToolWrapper>;

export const AspectRatioCalc = () => <GenericToolWrapper toolName="AspectRatioCalc"><AspectRatioCalcBase /></GenericToolWrapper>;
