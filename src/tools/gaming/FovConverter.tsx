import React, { useState, useEffect } from 'react';

export function FovConverter() {
  const [resolutionX, setResolutionX] = useState(1920);
  const [resolutionY, setResolutionY] = useState(1080);
  const [sourceMultiplier, setSourceMultiplier] = useState(16 / 9); // e.g. 16:9
  const [targetMultiplier, setTargetMultiplier] = useState(4 / 3);

  const [verticalFov, setVerticalFov] = useState(73.74); // typical 106 horizontal 16:9
  const [horizontalFov169, setHorizontalFov169] = useState(106);
  const [horizontalFov43, setHorizontalFov43] = useState(90);

  const calculateFromVertical = (vFov: number) => {
    // Math: hFOV = 2 * atan( multiplier * tan( vFOV / 2 ) )
    const vRad = (vFov * Math.PI) / 180;
    
    // For 16:9
    const hRad169 = 2 * Math.atan((16 / 9) * Math.tan(vRad / 2));
    const hDeg169 = hRad169 * (180 / Math.PI);
    
    // For 4:3
    const hRad43 = 2 * Math.atan((4 / 3) * Math.tan(vRad / 2));
    const hDeg43 = hRad43 * (180 / Math.PI);
    
    setHorizontalFov169(parseFloat(hDeg169.toFixed(2)));
    setHorizontalFov43(parseFloat(hDeg43.toFixed(2)));
  };

  const handleVerticalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVerticalFov(val);
    calculateFromVertical(val);
  };

  const handleHorizontal169Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setHorizontalFov169(val);
    
    // vFOV = 2 * atan( (1/multiplier) * tan( hFOV / 2 ) )
    const hRad = (val * Math.PI) / 180;
    const vRad = 2 * Math.atan((9 / 16) * Math.tan(hRad / 2));
    const vDeg = vRad * (180 / Math.PI);
    
    setVerticalFov(parseFloat(vDeg.toFixed(2)));
    // also update 4:3
    const hRad43 = 2 * Math.atan((4 / 3) * Math.tan(vRad / 2));
    setHorizontalFov43(parseFloat((hRad43 * (180 / Math.PI)).toFixed(2)));
  };

  const handleHorizontal43Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setHorizontalFov43(val);
    
    const hRad = (val * Math.PI) / 180;
    const vRad = 2 * Math.atan((3 / 4) * Math.tan(hRad / 2));
    const vDeg = vRad * (180 / Math.PI);
    
    setVerticalFov(parseFloat(vDeg.toFixed(2)));
    const hRad169 = 2 * Math.atan((16 / 9) * Math.tan(vRad / 2));
    setHorizontalFov169(parseFloat((hRad169 * (180 / Math.PI)).toFixed(2)));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 text-slate-800 dark:text-slate-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
         <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-center">
            <h2 className="font-bold text-lg">Field of View (FOV) Calculator</h2>
            <p className="text-sm text-slate-500 mt-1">Convert between Horizontal and Vertical FOV based on aspect ratio.</p>
         </div>

         <div className="p-8 space-y-8">
            <div>
              <label className="block text-sm font-bold mb-2">Vertical FOV (Engine Base)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" min="30" max="130" step="0.1" 
                  value={verticalFov} onChange={handleVerticalChange} 
                  className="flex-1 accent-indigo-500"
                />
                <input 
                  type="number" value={verticalFov} onChange={handleVerticalChange}
                  className="w-24 bg-slate-50 dark:bg-slate-800 border py-2 px-3 rounded font-mono text-center"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Used internally by Unreal Engine, Unity (by default), etc.</p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div>
              <label className="block text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400">Horizontal FOV (16:9 Aspect Ratio)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" min="50" max="150" step="0.1" 
                  value={horizontalFov169} onChange={handleHorizontal169Change} 
                  className="flex-1 accent-indigo-500"
                />
                <input 
                  type="number" value={horizontalFov169} onChange={handleHorizontal169Change}
                  className="w-24 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 py-2 px-3 rounded font-mono font-bold text-center"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Used by Source Engine (CS:GO, Apex), Overwatch, Call of Duty.</p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div>
              <label className="block text-sm font-bold mb-2 text-emerald-600 dark:text-emerald-400">Horizontal FOV (4:3 Aspect Ratio)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" min="40" max="140" step="0.1" 
                  value={horizontalFov43} onChange={handleHorizontal43Change} 
                  className="flex-1 accent-emerald-500"
                />
                <input 
                  type="number" value={horizontalFov43} onChange={handleHorizontal43Change}
                  className="w-24 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 py-2 px-3 rounded font-mono font-bold text-center"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Used by older games (Quake engine base) or stretched res players.</p>
            </div>
         </div>
         
         <div className="bg-slate-50 dark:bg-slate-800 p-6 border-t border-slate-200 dark:border-slate-700 text-sm">
            <h3 className="font-bold mb-2">Common Values:</h3>
            <ul className="space-y-1 text-slate-500 dark:text-slate-400 grid grid-cols-2 gap-2">
               <li><strong>CS:GO Default:</strong> 90 HFOV (4:3) = 106.26 HFOV (16:9)</li>
               <li><strong>Overwatch Max:</strong> 103 HFOV (16:9) = 70.53 VFOV</li>
               <li><strong>Valorant:</strong> Locked at 103 HFOV (16:9)</li>
               <li><strong>Apex Legends Max:</strong> 110 HFOV (4:3 scalar)</li>
            </ul>
         </div>
      </div>
    </div>
  );
}
