import React, { useState } from 'react';
import * as Diff from 'diff';

export function DiffViewer() {
  const [original, setOriginal] = useState('Apple\nBanana\nCorn\nDog');
  const [modified, setModified] = useState('Apple\nBanana\nCarrot\nDog\nElephant');
  const [diffResult, setDiffResult] = useState<Diff.Change[]>([]);

  const compare = () => {
    const diff = Diff.diffLines(original, modified);
    setDiffResult(diff);
  };

  React.useEffect(() => {
    compare();
  }, [original, modified]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 text-slate-50 text-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold mb-2">Original Text</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="w-full bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-lg p-4 font-mono text-sm h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-pre"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Modified Text</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            className="w-full bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-lg p-4 font-mono text-sm h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-pre"
          />
        </div>
      </div>

      <div className="bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-slate-800 bg-slate-800/50 p-4 border-b border-slate-700 border-slate-700 font-bold flex justify-between">
          <span>Difference</span>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 bg-red-900/30 border border-red-200 border-red-800 inline-block rounded-sm"></span> Removed</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 bg-green-900/30 border border-green-200 border-green-800 inline-block rounded-sm"></span> Added</span>
          </div>
        </div>
        <div className="p-4 overflow-x-auto font-mono text-sm whitespace-pre">
          {diffResult.map((part, index) => {
            let className = 'text-slate-50 text-slate-50';
            let bgClass = '';
            let prefix = '  ';

            if (part.added) {
              className = 'text-green-800 text-green-300';
              bgClass = 'bg-green-50 bg-green-900/20';
              prefix = '+ ';
            } else if (part.removed) {
              className = 'text-red-800 text-red-300';
              bgClass = 'bg-red-50 bg-red-900/20';
              prefix = '- ';
            }

            // Split into lines to render individual lines properly
            const lines = part.value.replace(/\n$/, '').split('\n');
            
            return (
              <div key={index} className={bgClass}>
                {lines.map((line, i) => (
                   <div key={i} className={`px-2 py-0.5 ${className}`}>
                     <span className="select-none opacity-50 mr-2">{prefix}</span>
                     <span>{line}</span>
                   </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
