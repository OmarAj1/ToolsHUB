import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { motion } from 'motion/react';

export function BorderRadiusGenerator() {
  const [tl, setTl] = useState(30);
  const [tr, setTr] = useState(70);
  const [br, setBr] = useState(70);
  const [bl, setBl] = useState(30);
  
  const [tl2, setTl2] = useState(30);
  const [tr2, setTr2] = useState(30);
  const [br2, setBr2] = useState(70);
  const [bl2, setBl2] = useState(70);

  const borderRadius = `${tl}% ${tr}% ${br}% ${bl}% / ${tl2}% ${tr2}% ${br2}% ${bl2}%`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`border-radius: ${borderRadius};`);
  };

  return (
    <div className="max-w-5xl animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Preview Area */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 min-h-[400px] relative">
          
          <div className="absolute inset-0 max-w-[400px] max-h-[400px] m-auto pointer-events-none">
             {/* Slider Handles representation visually wrapper */}
             {/* Top Control */}
             <div className="absolute -top-4 left-0 right-0 h-4 flex items-center">
                 <input type="range" min="0" max="100" value={tl} onChange={e => setTl(parseInt(e.target.value))} className="w-full accent-indigo-500 pointer-events-auto h-2" />
             </div>
             {/* Bottom Control */}
             <div className="absolute -bottom-4 left-0 right-0 h-4 flex items-center">
                 <input type="range" min="0" max="100" value={bl} onChange={e => setBl(parseInt(e.target.value))} className="w-full accent-indigo-500 pointer-events-auto h-2 rotate-180" />
             </div>
             {/* Left Control */}
             <div className="absolute top-0 bottom-0 -left-6 w-4 flex flex-col items-center justify-center">
                 <input type="range" min="0" max="100" value={tl2} onChange={e => setTl2(parseInt(e.target.value))} className="w-[400px] accent-indigo-500 pointer-events-auto h-2 -rotate-90 origin-center" />
             </div>
             {/* Right Control */}
             <div className="absolute top-0 bottom-0 -right-6 w-4 flex flex-col items-center justify-center">
                 <input type="range" min="0" max="100" value={tr2} onChange={e => setTr2(parseInt(e.target.value))} className="w-[400px] accent-indigo-500 pointer-events-auto h-2 rotate-90 origin-center" />
             </div>
          </div>

          <motion.div 
            className="w-full max-w-[300px] aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 flex items-center justify-center text-white font-bold"
            animate={{ borderRadius }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Controls */}
        <div className="space-y-8">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6">
            <h3 className="font-bold text-slate-800 dark:text-white">Radius Controls</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium"><span className="text-slate-500">Top Left X / Y</span></div>
                <div className="flex gap-4">
                  <input type="range" min="0" max="100" value={tl} onChange={e => setTl(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                  <input type="range" min="0" max="100" value={tl2} onChange={e => setTl2(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium"><span className="text-slate-500">Top Right X / Y</span></div>
                <div className="flex gap-4">
                  <input type="range" min="0" max="100" value={tr} onChange={e => {setTr(parseInt(e.target.value)); setTr2(100 - parseInt(e.target.value))}} className="w-full accent-indigo-500 hidden" />
                  {/* using individual states for full control */}
                  <input type="range" min="0" max="100" value={tr} onChange={e => setTr(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                  <input type="range" min="0" max="100" value={tr2} onChange={e => setTr2(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium"><span className="text-slate-500">Bottom Right X / Y</span></div>
                <div className="flex gap-4">
                  <input type="range" min="0" max="100" value={br} onChange={e => setBr(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                  <input type="range" min="0" max="100" value={br2} onChange={e => setBr2(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium"><span className="text-slate-500">Bottom Left X / Y</span></div>
                <div className="flex gap-4">
                  <input type="range" min="0" max="100" value={bl} onChange={e => setBl(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                  <input type="range" min="0" max="100" value={bl2} onChange={e => setBl2(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button onClick={() => {setTl(50); setTr(50); setBr(50); setBl(50); setTl2(50); setTr2(50); setBr2(50); setBl2(50);}} className="px-4 py-2 text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Circle</button>
              <button onClick={() => {setTl(30); setTr(70); setBr(70); setBl(30); setTl2(30); setTr2(30); setBr2(70); setBl2(70);}} className="px-4 py-2 text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Organic</button>
              <button onClick={() => {setTl(100); setTr(0); setBr(100); setBl(0); setTl2(0); setTr2(100); setBr2(0); setBl2(100);}} className="px-4 py-2 text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Leaf</button>
            </div>
          </div>

          <div className="relative group">
            <pre className="w-full p-4 bg-slate-900 text-slate-50 rounded-2xl text-sm overflow-x-auto font-mono custom-scrollbar">
              <code className="text-pink-400">border-radius</code>
              <code className="text-slate-300">: </code>
              <code className="text-teal-300">{borderRadius}</code>
              <code className="text-slate-300">;</code>
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2"
              title="Copy CSS"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
