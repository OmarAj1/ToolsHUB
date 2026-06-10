import React, { useState } from "react";
import { Upload, Trash2, ArrowRightLeft, AlignLeft, Search } from "lucide-react";
import { TextToolBase } from "./TextToolBase";

export function TextCompare() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diff, setDiff] = useState<{ type: 'added' | 'removed' | 'unchanged', text: string }[] | null>(null);

  const compare = () => {
    if (text1 === text2) {
      setDiff([{ type: 'unchanged', text: 'The texts are completely identical.' }]);
      return;
    }
    
    // Very basic line-by-line comparison
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const newDiff = [];
    
    const maxLines = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLines; i++) {
        const l1 = i < lines1.length ? lines1[i] : null;
        const l2 = i < lines2.length ? lines2[i] : null;

        if (l1 === l2) {
            newDiff.push({ type: 'unchanged' as const, text: l1! });
        } else {
            if (l1 !== null) {
                newDiff.push({ type: 'removed' as const, text: l1 });
            }
            if (l2 !== null) {
                newDiff.push({ type: 'added' as const, text: l2 });
            }
        }
    }
    
    setDiff(newDiff);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Original Text</label>
          <textarea
            value={text1}
            onChange={e => setText1(e.target.value)}
            className="w-full h-64 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
          />
        </div>
        <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Changed Text</label>
          <textarea
            value={text2}
            onChange={e => setText2(e.target.value)}
            className="w-full h-64 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <button onClick={compare} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5"/> Compare Texts
        </button>
      </div>
      {diff && (
        <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm whitespace-pre-wrap text-left overflow-x-auto">
          {diff.map((item, idx) => {
            if (item.type === 'added') {
              return <div key={idx} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded my-0.5">+ {item.text || ' '}</div>;
            }
            if (item.type === 'removed') {
              return <div key={idx} className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-0.5 rounded my-0.5 line-through">- {item.text || ' '}</div>;
            }
            return <div key={idx} className="text-slate-500 dark:text-slate-400 px-2 py-0.5 my-0.5">  {item.text || ' '}</div>;
          })}
        </div>
      )}
    </div>
  );
}

export function FindAndReplace() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");

  const handleProcess = () => {
      try {
        // basic global replace
        const escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const res = input.replace(new RegExp(escapedFind, 'g'), replace);
        setOutput(res);
      } catch (e) {
        alert("Error executing replace.");
      }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 mb-4"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Find</label>
                <input value={find} onChange={e=>setFind(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white" />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Replace With</label>
                <input value={replace} onChange={e=>setReplace(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white" />
            </div>
        </div>

        <button onClick={handleProcess} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
            <Search className="w-4 h-4"/> Replace All
        </button>
      </div>
      
      {output && (
        <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Result</label>
          <textarea readOnly value={output} className="w-full h-48 p-4 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm resize-y text-slate-800 dark:text-slate-200" />
        </div>
      )}
    </div>
  );
}

export function CsvCleaner() {
  const process = (input: string) => {
      // Remove empty lines, trim each cell
      const lines = input.split('\n');
      const cleaned = lines
        .map(line => line.split(',').map(c => c.trim()).join(','))
        .filter(line => line.replace(/,/g, '').trim().length > 0) // Remove lines that are just empty cells
      return cleaned.join('\n');
  };
  return <TextToolBase title="CSV Cleaner" description="Remove empty rows and trim spaces from cells." actionButtonText="Clean CSV" onProcess={process} />;
}

export function TextFormatter() {
    const process = (input: string) => {
        // Fix weird spacing, ensure space after periods
        return input
          .replace(/\s+/g, ' ') // Collapse multiple spaces
          .replace(/\s+([.,!?])/g, '$1') // Remove spaces before punctuation
          .replace(/([.,!?])(?=[^\s"'])/g, '$1 ') // Add spaces after punctuation if missing
          .trim();
    };
    return <TextToolBase title="Text Formatter" description="Auto-format spaces and punctuation." actionButtonText="Format Text" onProcess={process} />;
}
