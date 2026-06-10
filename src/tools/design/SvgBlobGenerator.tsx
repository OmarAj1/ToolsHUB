import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export function SvgBlobGenerator() {
  const [complexity, setComplexity] = useState(5);
  const [contrast, setContrast] = useState(5);
  const [color, setColor] = useState('#3b82f6');
  const [svgPath, setSvgPath] = useState('');
  const [copied, setCopied] = useState(false);

  // Simple blob generation logic (for visual representation, generates a smooth path)
  const generateBlob = () => {
    const points = [];
    const numPoints = complexity + 3;
    const angleStep = (Math.PI * 2) / numPoints;

    for (let i = 1; i <= numPoints; i++) {
        const pull = (Math.random() - 0.5) * (contrast * 0.1); 
        const radius = 100 + (pull * 100);
        const theta = i * angleStep;
        const x = 200 + radius * Math.cos(theta);
        const y = 200 + radius * Math.sin(theta);
        points.push({ x, y });
    }

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    
    // Spline curve generation
    let path = `M ${firstPoint.x} ${firstPoint.y}`;
    
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      
      const xc = (p1.x + p2.x) / 2;
      const yc = (p1.y + p2.y) / 2;
      
      path += ` Q ${p1.x} ${p1.y}, ${xc} ${yc}`;
    }
    
    // ensure closed path cleanly
    path += ` Z`;

    setSvgPath(path);
  };

  useEffect(() => {
    generateBlob();
  }, [complexity, contrast]);

  const svgCode = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <path fill="${color}" d="${svgPath}" />
</svg>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[60vh] text-slate-800 dark:text-slate-200">
      {/* Visual Editor (Preview) */}
      <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950/50 shadow-inner">
         <div className="w-full max-w-sm aspect-square">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl transition-all duration-300 ease-in-out">
              <path fill={color} d={svgPath} className="transition-all duration-500 ease-in-out" />
            </svg>
         </div>
      </div>

      {/* Controls */}
      <div className="w-full md:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6">
        
        <div className="flex justify-between items-center mb-2">
           <h3 className="font-bold">Generator Controls</h3>
           <button 
             onClick={generateBlob}
             className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors"
           >
              <RefreshCw className="w-3.5 h-3.5" /> Randomize
           </button>
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">Complexity: {complexity}</label>
          <input type="range" min="3" max="20" value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} className="w-full accent-indigo-500" />
        </div>

        <div>
          <label className="text-sm font-bold block mb-2">Contrast: {contrast}</label>
          <input type="range" min="1" max="10" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-indigo-500" />
        </div>

        <div>
           <label className="text-sm font-bold block mb-2">Theme Color</label>
           <div className="flex items-center gap-4">
             <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded cursor-pointer" />
           </div>
        </div>

        <div className="mt-4 flex-1">
          <label className="text-sm font-bold block mb-2 text-indigo-600 dark:text-indigo-400">SVG Code</label>
          <div className="relative group">
            <pre className="p-4 bg-slate-100 dark:bg-slate-950 rounded-lg text-sm font-mono text-slate-700 dark:text-slate-300 overflow-auto max-h-48 border border-slate-200 dark:border-slate-800">
              <code>{svgCode}</code>
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
