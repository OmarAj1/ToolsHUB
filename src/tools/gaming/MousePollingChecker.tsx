import React, { useState, useEffect, useRef } from 'react';

export function MousePollingChecker() {
  const [hz, setHz] = useState(0);
  const [maxHz, setMaxHz] = useState(0);
  const [avgHz, setAvgHz] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  const countRef = useRef(0);
  const totalRef = useRef(0);
  const ticksRef = useRef(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording) {
      countRef.current = 0;
      totalRef.current = 0;
      ticksRef.current = 0;
      setMaxHz(0);
      setAvgHz(0);

      const handleMouseMove = () => {
        countRef.current++;
      };

      window.addEventListener('mousemove', handleMouseMove);

      interval = setInterval(() => {
        const currentHz = countRef.current;
        setHz(currentHz);
        
        if (currentHz > 0) {
           setMaxHz(prev => Math.max(prev, currentHz));
           totalRef.current += currentHz;
           ticksRef.current++;
           setAvgHz(Math.round(totalRef.current / ticksRef.current));
        }
        
        countRef.current = 0; // reset for next second
      }, 1000);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearInterval(interval);
      };
    }
  }, [isRecording]);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 text-slate-800 dark:text-slate-200">
      <div className="text-center mb-8">
        <p className="text-slate-500">Move your mouse in continuous circles inside the box to test polling rate.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-8">
         <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="font-bold">Polling Rate Test</h2>
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`px-6 py-2 rounded-lg font-bold text-white transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isRecording ? 'Stop Test' : 'Start Test'}
            </button>
         </div>

         <div className={`h-[400px] border-b border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center transition-colors ${isRecording ? 'bg-slate-50 dark:bg-slate-950 outline-none ring-2 ring-inset ring-indigo-500 cursor-crosshair' : 'bg-slate-100 dark:bg-slate-800/50'}`}>
            {isRecording ? (
               <>
                 <div className="text-8xl font-black font-mono tabular-nums text-indigo-600 dark:text-indigo-400">{hz}</div>
                 <div className="text-sm font-bold uppercase tracking-widest text-slate-400 mt-2">Hz (Current)</div>
               </>
            ) : (
               <div className="text-slate-400 font-bold">Click "Start Test" to begin</div>
            )}
         </div>

         <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800 bg-slate-50 dark:bg-slate-900">
           <div className="p-6 text-center">
             <div className="text-3xl font-black font-mono tabular-nums">{maxHz}</div>
             <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Maximum Hz</div>
           </div>
           <div className="p-6 text-center">
             <div className="text-3xl font-black font-mono tabular-nums">{avgHz}</div>
             <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Average Hz</div>
           </div>
         </div>
      </div>
    </div>
  );
}
