import React, { useState, useEffect } from 'react';
import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";

function ColorPickerBase() {
  const [hex, setHex] = useState('#3b82f6');
  const [rgb, setRgb] = useState('59, 130, 246');
  const [hsl, setHsl] = useState('217, 91%, 60%');

  const hexToRgb = (h: string) => {
    let r = 0, g = 0, b = 0;
    if (h.length === 4) {
      r = parseInt(h[1] + h[1], 16);
      g = parseInt(h[2] + h[2], 16);
      b = parseInt(h[3] + h[3], 16);
    } else if (h.length === 7) {
      r = parseInt(h.slice(1, 3), 16);
      g = parseInt(h.slice(3, 5), 16);
      b = parseInt(h.slice(5, 7), 16);
    }
    return `${r}, ${g}, ${b}`;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHex(val);
    if (/^#[0-9A-Fa-f]{6}$/i.test(val) || /^#[0-9A-Fa-f]{3}$/i.test(val)) {
      const rgbVal = hexToRgb(val);
      setRgb(rgbVal);
      const [r, g, b] = rgbVal.split(',').map(n => parseInt(n.trim()));
      setHsl(rgbToHsl(r, g, b));
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[60vh] text-slate-50">
      <div className="w-full md:w-96 bg-slate-800 border-r border-slate-700 p-6 flex flex-col gap-6">
        <div>
          <label className="text-sm font-bold block mb-2">Color Input</label>
          <div className="w-full h-32 rounded-xl border-4 border-slate-700 mb-4 flex items-center justify-center overflow-hidden">
             <input 
               type="color" 
               value={/^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : "#000000"} 
               onChange={handleHexChange}
               className="w-full h-64 cursor-pointer p-0 m-0 border-0 outline-none transform scale-150" 
             />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">HEX</label>
            <input 
              type="text" 
              value={hex} 
              onChange={handleHexChange}
              className="w-full mt-1 bg-slate-900 border border-slate-700 px-3 py-2 rounded font-mono text-sm uppercase text-slate-200" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">RGB</label>
            <input 
              readOnly
              type="text" 
              value={`rgb(${rgb})`} 
              className="w-full mt-1 bg-slate-900 border border-slate-700 px-3 py-2 rounded font-mono text-sm text-slate-200 outline-none cursor-pointer hover:border-slate-600 transition-colors"
              onClick={() => navigator.clipboard.writeText(`rgb(${rgb})`)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">HSL</label>
            <input 
              readOnly
              type="text" 
              value={`hsl(${hsl})`} 
              className="w-full mt-1 bg-slate-900 border border-slate-700 px-3 py-2 rounded font-mono text-sm text-slate-200 outline-none cursor-pointer hover:border-slate-600 transition-colors" 
              onClick={() => navigator.clipboard.writeText(`hsl(${hsl})`)}
            />
          </div>
        </div>
      </div>

      <div 
        className="flex-1 p-8 flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: hex }}
      >
         <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full border border-slate-700/50">
           <div className="w-24 h-24 rounded-full mx-auto mb-6 shadow-highlight" style={{ backgroundColor: hex, border: '4px solid white' }}></div>
           <h2 className="text-3xl font-black mb-2 text-white uppercase">{hex}</h2>
           <p className="text-slate-300 font-mono text-sm mb-4">rgb({rgb})</p>
           <button 
             onClick={() => navigator.clipboard.writeText(hex)}
             className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/20"
           >
             Copy Hex Code
           </button>
         </div>
      </div>
    </div>
  );
}

export const ColorPicker = () => <GenericToolWrapper toolName="ColorPicker"><ColorPickerBase /></GenericToolWrapper>;
