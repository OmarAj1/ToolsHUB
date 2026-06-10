import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');

  // Config
  const [workTime, setWorkTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            if (interval) clearInterval(interval);
            // Auto-switch or notification could go here
            new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(() => {});
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, minutes]);

  useEffect(() => {
    // Reset timer when mode changes
    setIsActive(false);
    if (mode === 'work') setMinutes(workTime);
    if (mode === 'shortBreak') setMinutes(shortBreakTime);
    if (mode === 'longBreak') setMinutes(longBreakTime);
    setSeconds(0);
  }, [mode, workTime, shortBreakTime, longBreakTime]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') setMinutes(workTime);
    else if (mode === 'shortBreak') setMinutes(shortBreakTime);
    else setMinutes(longBreakTime);
    setSeconds(0);
  };

  const saveSettings = () => {
    setShowSettings(false);
    resetTimer();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 text-slate-800 dark:text-slate-200">
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden transition-colors">
         
         <button onClick={() => setShowSettings(!showSettings)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-indigo-500 transition-colors">
           <Settings className="w-5 h-5" />
         </button>

         {showSettings ? (
           <div className="space-y-6">
             <h3 className="font-bold text-xl mb-6">Settings</h3>
             <div>
               <label className="block text-sm font-bold mb-2">Work Minutes</label>
               <input type="number" min="1" max="60" value={workTime} onChange={e => setWorkTime(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-800 border p-3 rounded" />
             </div>
             <div>
               <label className="block text-sm font-bold mb-2">Short Break Minutes</label>
               <input type="number" min="1" max="30" value={shortBreakTime} onChange={e => setShortBreakTime(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-800 border p-3 rounded" />
             </div>
             <div>
               <label className="block text-sm font-bold mb-2">Long Break Minutes</label>
               <input type="number" min="1" max="60" value={longBreakTime} onChange={e => setLongBreakTime(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-800 border p-3 rounded" />
             </div>
             <button onClick={saveSettings} className="w-full bg-indigo-600 text-white font-bold py-3 rounded mt-4">Save & Close</button>
           </div>
         ) : (
           <div className="flex flex-col items-center">
             
             <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-full mb-12">
               <button onClick={() => setMode('work')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'work' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>Pomodoro</button>
               <button onClick={() => setMode('shortBreak')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'shortBreak' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>Short Break</button>
               <button onClick={() => setMode('longBreak')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'longBreak' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>Long Break</button>
             </div>

             <div className={`text-8xl sm:text-9xl font-mono font-black tabular-nums tracking-tighter mb-12 transition-colors ${mode === 'work' ? 'text-indigo-600 dark:text-indigo-400' : mode === 'shortBreak' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
               {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
             </div>

             <div className="flex items-center gap-6">
                <button 
                  onClick={toggleTimer}
                  className={`w-20 h-20 flex items-center justify-center rounded-full text-white shadow-lg shadow-indigo-500/30 transition-transform active:scale-95 ${isActive ? 'bg-red-500' : 'bg-indigo-600'}`}
                >
                  {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
                </button>
                <button 
                  onClick={resetTimer}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  <RotateCcw className="w-6 h-6 text-slate-500" />
                </button>
             </div>

           </div>
         )}
      </div>

      <div className="text-center mt-6 text-sm text-slate-500">
        Runs locally in your browser.
      </div>
    </div>
  );
}
