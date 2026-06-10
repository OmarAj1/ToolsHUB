import React, { useState, useEffect } from 'react';

export function ColorContrastChecker() {
  const [color1, setColor1] = useState('#ffffff');
  const [color2, setColor2] = useState('#000000');
  const [contrastRatio, setContrastRatio] = useState(21);

  const calculateLuminance = (r: number, g: number, b: number) => {
    let [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const calculateContrastRatio = (c1: string, c2: string) => {
    const rgb1 = hexToRgb(c1);
    const rgb2 = hexToRgb(c2);
    if (!rgb1 || !rgb2) return 1;

    const l1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);

    return (lightest + 0.05) / (darkest + 0.05);
  };

  useEffect(() => {
    setContrastRatio(calculateContrastRatio(color1, color2));
  }, [color1, color2]);

  const passesAA = contrastRatio >= 4.5;
  const passesAAA = contrastRatio >= 7;
  const passesAALarge = contrastRatio >= 3;
  const passesAAALarge = contrastRatio >= 4.5;

  return (
    <div className="flex flex-col md:flex-row min-h-[60vh] text-slate-800 dark:text-slate-200">
      {/* Editor Controls */}
      <div className="w-full md:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6">
        <div>
          <label className="text-sm font-bold block mb-2">Foreground Color</label>
          <div className="flex items-center gap-4">
            <input 
              type="color" value={color1} 
              onChange={(e) => setColor1(e.target.value)} 
              className="h-10 w-24 rounded border border-slate-200 dark:border-slate-800 cursor-pointer p-0" 
            />
            <input 
              type="text" value={color1} 
              onChange={(e) => setColor1(e.target.value)}
              className="flex-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded uppercase font-mono text-sm" 
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">Background Color</label>
          <div className="flex items-center gap-4">
            <input 
              type="color" value={color2} 
              onChange={(e) => setColor2(e.target.value)} 
              className="h-10 w-24 rounded border border-slate-200 dark:border-slate-800 cursor-pointer p-0" 
            />
            <input 
              type="text" value={color2} 
              onChange={(e) => setColor2(e.target.value)}
              className="flex-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded uppercase font-mono text-sm" 
            />
          </div>
        </div>

        <div className="mt-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center mb-6">
            <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
              {contrastRatio.toFixed(2)}
            </div>
            <div className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Contrast Ratio</div>
          </div>
          
          <div className="space-y-3">
             <ResultRow label="AA Normal Text" pass={passesAA} />
             <ResultRow label="AA Large Text" pass={passesAALarge} />
             <ResultRow label="AAA Normal Text" pass={passesAAA} />
             <ResultRow label="AAA Large Text" pass={passesAAALarge} />
          </div>
        </div>
      </div>

      {/* Visual Preview */}
      <div 
        className="flex-1 p-8 grid place-items-center"
        style={{ backgroundColor: color2 }}
      >
         <div className="max-w-md space-y-6" style={{ color: color1 }}>
           <h1 className="text-4xl font-bold">This is a Large Heading</h1>
           <p className="text-lg leading-relaxed font-medium">
             This is normal sized text. The contrast ratio checks how readable text is against its background. Good contrast makes your application accessible to everyone.
           </p>
           <button 
             className="px-6 py-3 border-2 font-bold rounded shadow-sm hover:opacity-80 transition-opacity" 
             style={{ borderColor: color1 }}
           >
             Interactive Button
           </button>
         </div>
      </div>
    </div>
  );
}

function ResultRow({ label, pass }: { label: string, pass: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <span className="font-medium text-sm">{label}</span>
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${pass ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
        {pass ? 'PASS' : 'FAIL'}
      </span>
    </div>
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
