import React, { useState, useEffect } from 'react';
import cronstrue from 'cronstrue';
import { Copy, Check } from 'lucide-react';

export function CronJobGenerator() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [cronExpression, setCronExpression] = useState('* * * * *');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const expr = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    setCronExpression(expr);
    try {
      setDescription(cronstrue.toString(expr));
    } catch (e) {
      setDescription('Invalid cron expression');
    }
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: 'Every minute', expr: '* * * * *' },
    { label: 'Every hour', expr: '0 * * * *' },
    { label: 'Every day at midnight', expr: '0 0 * * *' },
    { label: 'Every Sunday', expr: '0 0 * * 0' },
  ];

  const applyPreset = (expr: string) => {
    const parts = expr.split(' ');
    setMinute(parts[0]);
    setHour(parts[1]);
    setDayOfMonth(parts[2]);
    setMonth(parts[3]);
    setDayOfWeek(parts[4]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-slate-50 text-slate-50">
      <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-8 text-center border-b border-slate-700 border-slate-700 bg-slate-900 bg-slate-800/50">
          <h2 className="text-4xl font-mono font-bold text-blue-600 text-blue-400 mb-4 tracking-widest">{cronExpression}</h2>
          <p className="text-xl font-medium">{description}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Minute</label>
              <input type="text" value={minute} onChange={(e) => setMinute(e.target.value)} className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded p-2 text-center font-mono" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Hour</label>
              <input type="text" value={hour} onChange={(e) => setHour(e.target.value)} className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded p-2 text-center font-mono" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Day (Month)</label>
              <input type="text" value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded p-2 text-center font-mono" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Month</label>
              <input type="text" value={month} onChange={(e) => setMonth(e.target.value)} className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded p-2 text-center font-mono" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Day (Week)</label>
              <input type="text" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded p-2 text-center font-mono" />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
             <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors">
               {copied ? <Check className="w-5 h-5 text-purple-500" /> : <Copy className="w-5 h-5 text-purple-500" />}
               {copied ? 'Copied!' : 'Copy Expression'}
             </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-2xl shadow-sm p-6">
         <h3 className="font-bold mb-4">Common Presets</h3>
         <div className="flex flex-wrap gap-3">
           {presets.map((preset, i) => (
             <button key={i} onClick={() => applyPreset(preset.expr)} className="px-4 py-2 bg-slate-800 hover:bg-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md text-sm font-medium transition-colors">
               {preset.label}
             </button>
           ))}
         </div>
      </div>
    </div>
  );
}
