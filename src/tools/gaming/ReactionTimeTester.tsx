import React, { useState, useEffect, useRef } from 'react';
import { Zap, RotateCcw } from 'lucide-react';

export function ReactionTimeTester() {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [result, setResult] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (state === 'idle' || state === 'result') {
      startTest();
    } else if (state === 'waiting') {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('result');
      setResult(-1); // denotes a "too soon" false start
    } else if (state === 'ready') {
      // Good click
      const endTime = performance.now();
      const diff = Math.round(endTime - startTimeRef.current);
      setResult(diff);
      setState('result');
      if (best === null || diff < best) {
        setBest(diff);
      }
    }
  };

  const startTest = () => {
    setState('waiting');
    setResult(null);
    const delay = Math.random() * 3000 + 1500; // 1.5s to 4.5s
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      startTimeRef.current = performance.now();
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="p-4 md:p-8 flex flex-col h-full max-w-4xl mx-auto items-center justify-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-900 dark:text-white flex items-center justify-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500" />
          Reaction Time Tester
        </h2>
        <p className="text-stone-500 mt-2">Test your visual reflexes. Click when the screen turns green.</p>
      </div>

      <div 
        onClick={handleClick}
        className={`w-full max-w-3xl aspect-[16/9] md:aspect-[21/9] rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 select-none shadow-xl border-4 ${
          state === 'idle' 
            ? 'bg-blue-500 hover:bg-blue-600 border-blue-600/50' 
            : state === 'waiting' 
              ? 'bg-red-500 hover:bg-red-600 border-red-600/50' 
              : state === 'ready' 
                ? 'bg-emerald-500 border-emerald-600/50' 
                : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700'
        }`}
      >
        <div className="text-center space-y-4 px-6">
          {state === 'idle' && (
            <>
              <Zap className="w-16 h-16 text-white/80 mx-auto animate-pulse" />
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider">Click to Start</h3>
              <p className="text-blue-100 font-medium">When the red box turns green, click as fast as you can.</p>
            </>
          )}

          {state === 'waiting' && (
            <>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wider">Wait for green...</h3>
            </>
          )}

          {state === 'ready' && (
            <>
              <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-wider">CLICK!</h3>
            </>
          )}

          {state === 'result' && (
            <div className="animate-in fade-in zoom-in duration-300">
              {result === -1 ? (
                <>
                  <h3 className="text-3xl md:text-5xl font-black text-stone-800 dark:text-white uppercase tracking-wider mb-2">Too soon!</h3>
                  <p className="text-stone-500 dark:text-stone-400 font-medium text-lg mb-8">You clicked before it turned green.</p>
                </>
              ) : (
                <>
                  <p className="text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest text-sm mb-2">Your Time</p>
                  <h3 className="text-6xl md:text-8xl font-black text-stone-900 dark:text-white tracking-tighter mb-8 bg-gradient-to-br from-stone-800 to-stone-500 dark:from-white dark:to-stone-400 bg-clip-text text-transparent">
                    {result} <span className="text-3xl md:text-5xl text-stone-400">ms</span>
                  </h3>
                </>
              )}
              
              <div className="flex flex-col items-center gap-4">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center w-full max-w-3xl">
        <div className="bg-white dark:bg-stone-900 rounded-2xl px-8 py-4 shadow-sm border border-stone-200 dark:border-stone-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Personal Best</p>
            <p className="text-2xl font-black text-stone-900 dark:text-white">
              {best ? `${best} ms` : '---'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
