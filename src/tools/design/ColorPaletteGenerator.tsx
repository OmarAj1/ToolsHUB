import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import React, { useState } from 'react';
import { Copy, Plus, Shuffle } from 'lucide-react';

function ColorPaletteGeneratorBase() {
  const [baseColor, setBaseColor] = useState('#3b82f6'); // default tailwind blue-500
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = hexToRgb(baseColor);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : [0, 0, 0];

  // Helper to safely format HSL
  const getHslHex = (hOffset: number, sOffset: number, lOffset: number) => {
    let h = (hsl[0] + hOffset) % 360;
    if (h < 0) h += 360;
    
    let s = Math.min(100, Math.max(0, hsl[1] * 100 + sOffset));
    let l = Math.min(100, Math.max(0, hsl[2] * 100 + lOffset));
    
    return hslToHex(h, s, l);
  };

  const palettes = {
    analogous: [
      getHslHex(-60, 0, 0),
      getHslHex(-30, 0, 0),
      baseColor,
      getHslHex(30, 0, 0),
      getHslHex(60, 0, 0),
    ],
    monochromatic: [
      getHslHex(0, 0, -40),
      getHslHex(0, 0, -20),
      baseColor,
      getHslHex(0, 0, 20),
      getHslHex(0, 0, 40),
    ],
    triadic: [
      baseColor,
      getHslHex(120, 0, 0),
      getHslHex(240, 0, 0),
    ],
    complementary: [
      baseColor,
      getHslHex(180, 0, 0),
    ],
    splitComplementary: [
      baseColor,
      getHslHex(150, 0, 0),
      getHslHex(210, 0, 0),
    ]
  };

  const generateRandom = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setBaseColor(randomHex);
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="p-6 md:p-8 text-slate-50 text-slate-50">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 p-6 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-xl font-bold mb-1">Base Color</h2>
            <p className="text-sm text-slate-400 text-slate-50">Select a color to generate harmonies.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <input 
              type="color" 
              value={baseColor} 
              onChange={(e) => setBaseColor(e.target.value)} 
              className="w-16 h-12 rounded cursor-pointer p-0 border border-slate-700 border-slate-700" 
            />
            <div className="bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 px-4 py-2.5 rounded font-mono font-bold uppercase text-lg">
              {baseColor}
            </div>
            <button 
              onClick={generateRandom}
              className="p-3 bg-slate-800 hover:bg-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors text-slate-50 text-slate-50"
              title="Random Color"
            >
              <Shuffle className="w-5 h-5 text-purple-500" />
            </button>
          </div>
        </div>

        {/* Palettes */}
        <div className="space-y-10">
          <PaletteSection title="Analogous" description="Colors next to each other on the color wheel." colors={palettes.analogous} copied={copied} onCopy={copyToClipboard} />
          <PaletteSection title="Monochromatic" description="Variations in lightness and saturation of the base color." colors={palettes.monochromatic} copied={copied} onCopy={copyToClipboard} />
          <PaletteSection title="Triadic" description="Colors that are evenly spaced around the color wheel." colors={palettes.triadic} copied={copied} onCopy={copyToClipboard} />
          <PaletteSection title="Complementary" description="Colors opposite each other on the color wheel." colors={palettes.complementary} copied={copied} onCopy={copyToClipboard} />
          <PaletteSection title="Split Complementary" description="A base color and two colors adjacent to its complement." colors={palettes.splitComplementary} copied={copied} onCopy={copyToClipboard} />
        </div>
      </div>
    </div>
  );
}

function PaletteSection({ title, description, colors, copied, onCopy }: { title: string, description: string, colors: string[], copied: string | null, onCopy: (c: string) => void }) {
  return (
    <div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-slate-400 text-slate-50 mb-4">{description}</p>
      <div className="flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-sm border border-slate-700 border-slate-700 h-48">
        {colors.map((c, i) => (
          <div key={i} className="flex-1 min-w-0 transition-all hover:flex-[1.2] relative group cursor-pointer" style={{ backgroundColor: c }} onClick={() => onCopy(c)}>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-end">
              <span className="font-mono font-bold text-white uppercase tracking-wider drop-shadow-md">
                {copied === c ? 'COPIED!' : c}
              </span>
            </div>
            {copied === c && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="bg-slate-800 text-slate-50 px-3 py-1 rounded text-sm font-bold shadow-lg">Copied!</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Color Math Utilities
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
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
  return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

export const ColorPaletteGenerator = () => <GenericToolWrapper toolName="ColorPaletteGenerator"><ColorPaletteGeneratorBase /></GenericToolWrapper>;
