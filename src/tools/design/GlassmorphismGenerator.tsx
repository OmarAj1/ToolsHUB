import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.5);
  const [color, setColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);

  const rgbColor = hexToRgb(color);
  
  const cssString = `background: rgba(${rgbColor?.r}, ${rgbColor?.g}, ${rgbColor?.b}, ${opacity});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(255, 255, 255, 0.3);
border-radius: 16px;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[60vh] text-slate-800 dark:text-slate-200">
      {/* Visual Editor (Preview) */}
      <div 
        className="flex-1 p-8 flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'url("https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop") center/cover no-repeat',
        }}
      >
        <div 
          className="w-full max-w-sm h-64 shadow-2xl flex items-center justify-center text-center p-6"
          style={{
            background: `rgba(${rgbColor?.r}, ${rgbColor?.g}, ${rgbColor?.b}, ${opacity})`,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '16px'
          }}
        >
          <h2 className="text-2xl font-bold text-white drop-shadow-md">Glassmorphism</h2>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full md:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6">
        <div>
          <label className="text-sm font-bold block mb-2">Blur Value</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" min="0" max="40" step="1" 
              value={blur} onChange={(e) => setBlur(Number(e.target.value))}
              className="flex-1 accent-indigo-500"
            />
            <span className="w-12 text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-center">{blur}px</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">Opacity</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" min="0" max="1" step="0.05" 
              value={opacity} onChange={(e) => setOpacity(Number(e.target.value))}
              className="flex-1 accent-indigo-500"
            />
            <span className="w-12 text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-center">{opacity}</span>
          </div>
        </div>

        <div>
           <label className="text-sm font-bold block mb-2">Color</label>
           <div className="flex items-center gap-4">
             <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded cursor-pointer" />
           </div>
        </div>

        <div className="mt-8 flex-1">
          <label className="text-sm font-bold block mb-2 text-indigo-600 dark:text-indigo-400">CSS Code</label>
          <div className="relative group">
            <pre className="p-4 bg-slate-100 dark:bg-slate-950 rounded-lg text-sm font-mono text-slate-700 dark:text-slate-300 overflow-x-auto border border-slate-200 dark:border-slate-800">
              <code>{cssString}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
}
