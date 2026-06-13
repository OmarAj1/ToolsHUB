import { GenericToolWrapper } from "../../components/ui/GenericToolWrapper";
import React, { useState } from 'react';
import { Copy, Check, Plus, Trash2 } from 'lucide-react';

function CssGradientGeneratorBase() {
  const [type, setType] = useState<'linear-gradient' | 'radial-gradient'>('linear-gradient');
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState([
    { color: '#4f46e5', position: 0 },
    { color: '#a855f7', position: 100 }
  ]);
  const [copied, setCopied] = useState(false);

  const gradientString = `${type}(${type === 'linear-gradient' ? `${angle}deg, ` : 'circle, '}${stops.map(s => `${s.color} ${s.position}%`).join(', ')})`;
  const cssCode = `background: ${gradientString};`;

  const addStop = () => {
    if (stops.length >= 5) return;
    const newStops = [...stops];
    // Find middle position
    const pos = Math.round((newStops[0].position + newStops[newStops.length - 1].position) / 2);
    newStops.splice(1, 0, { color: '#ec4899', position: pos });
    setStops(newStops.sort((a, b) => a.position - b.position));
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    const newStops = [...stops];
    newStops.splice(index, 1);
    setStops(newStops);
  };

  const updateStop = (index: number, field: 'color' | 'position', value: any) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], [field]: value };
    if (field === 'position') {
      newStops.sort((a, b) => a.position - b.position);
    }
    setStops(newStops);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[60vh] text-slate-50 text-slate-50">
      {/* Visual Editor (Preview) */}
      <div 
        className="flex-1 p-8 flex items-center justify-center relative overflow-hidden transition-all shadow-inner border-b md:border-b-0 md:border-r border-slate-700 border-slate-700"
        style={{ backgroundImage: gradientString }}
      >
      </div>

      {/* Controls */}
      <div className="w-full md:w-96 bg-slate-800 bg-slate-800 border-l border-slate-700 border-slate-700 p-6 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
        
        <div className="flex bg-slate-800 bg-slate-800 p-1 rounded-lg">
           <button 
             onClick={() => setType('linear-gradient')}
             className={`flex-1 py-1.5 text-sm font-bold rounded-md ${type === 'linear-gradient' ? 'bg-slate-800 bg-slate-800 shadow-sm' : 'text-slate-400'}`}
           >
             Linear
           </button>
           <button 
             onClick={() => setType('radial-gradient')}
             className={`flex-1 py-1.5 text-sm font-bold rounded-md ${type === 'radial-gradient' ? 'bg-slate-800 bg-slate-800 shadow-sm' : 'text-slate-400'}`}
           >
             Radial
           </button>
        </div>

        {type === 'linear-gradient' && (
          <div>
            <label className="text-sm font-bold block mb-2">Angle: {angle}°</label>
            <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
        )}

        <div>
           <div className="flex justify-between items-center mb-4">
             <label className="text-sm font-bold block">Color Stops</label>
             <button 
               onClick={addStop}
               disabled={stops.length >= 5}
               className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 bg-blue-900/30 text-blue-400 rounded text-xs font-bold disabled:opacity-50"
             >
               <Plus className="w-3 h-3 text-purple-500" /> Add Color
             </button>
           </div>
           
           <div className="space-y-3">
             {stops.map((stop, index) => (
               <div key={index} className="flex items-center gap-3 bg-slate-900 bg-slate-800/50 p-2 rounded-lg border border-slate-700 border-slate-700">
                 <input 
                   type="color" 
                   value={stop.color} 
                   onChange={(e) => updateStop(index, 'color', e.target.value)} 
                   className="w-10 h-10 rounded cursor-pointer shrink-0" 
                 />
                 <div className="flex-1 flex flex-col">
                   <div className="flex justify-between text-xs mb-1">
                     <span className="font-mono text-slate-400">{stop.color}</span>
                     <span className="font-bold">{stop.position}%</span>
                   </div>
                   <input 
                     type="range" 
                     min="0" max="100" 
                     value={stop.position} 
                     onChange={(e) => updateStop(index, 'position', Number(e.target.value))} 
                     className="w-full accent-blue-500" 
                   />
                 </div>
                 <button 
                   onClick={() => removeStop(index)}
                   disabled={stops.length <= 2}
                   className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors shrink-0"
                 >
                   <Trash2 className="w-4 h-4 text-purple-500" />
                 </button>
               </div>
             ))}
           </div>
        </div>

        <div className="mt-4 flex-1">
          <label className="text-sm font-bold block mb-2 text-blue-600 text-blue-400">CSS Code</label>
          <div className="relative group">
            <pre className="p-4 bg-slate-800 bg-slate-900 rounded-lg text-sm font-mono text-slate-50 text-slate-50 overflow-x-auto border border-slate-700 border-slate-700 whitespace-pre-wrap word-break">
              <code>{cssCode}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-slate-800 bg-slate-800 text-slate-50 text-slate-50 hover:text-blue-600 hover:text-blue-400 rounded-md shadow-sm border border-slate-700 border-slate-700 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-purple-500" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const CssGradientGenerator = () => <GenericToolWrapper toolName="CssGradientGenerator"><CssGradientGeneratorBase /></GenericToolWrapper>;
