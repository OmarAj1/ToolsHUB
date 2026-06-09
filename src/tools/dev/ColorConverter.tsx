import { useState, useEffect } from "react";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number) {
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorConverter() {
  const [color, setColor] = useState("#3B82F6");
  const [rgbStr, setRgbStr] = useState("rgb(59, 130, 246)");
  const [hslStr, setHslStr] = useState("hsl(217, 91%, 60%)");

  useEffect(() => {
    const rgb = hexToRgb(color);
    if (rgb) {
      setRgbStr(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHslStr(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    } else {
      setRgbStr("Invalid hex");
      setHslStr("Invalid hex");
    }
  }, [color]);

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col items-center p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div 
            className="w-32 h-32 rounded-full shadow-inner mb-6 border-4 border-white transition-colors duration-200" 
            style={{ backgroundColor: color, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' }} 
          />
          <div className="relative w-full max-w-xs">
             <input
               type="color"
               value={color}
               onChange={(e) => setColor(e.target.value)}
               className="w-full h-12 rounded-xl cursor-pointer opacity-0 absolute inset-0 z-10"
             />
             <div className="flex items-center justify-center w-full h-12 border-2 border-slate-200 rounded-xl font-mono text-slate-700 bg-slate-50 font-bold">
               {color.toUpperCase()}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">HEX</label>
             <div className="font-mono text-lg font-medium text-slate-800">{color.toUpperCase()}</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">RGB</label>
             <div className="font-mono text-lg font-medium text-slate-800">{rgbStr}</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">HSL</label>
             <div className="font-mono text-lg font-medium text-slate-800">{hslStr}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
