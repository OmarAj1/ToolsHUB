import React, { useState } from "react";
import { Upload, Trash2, ArrowRightLeft, AlignLeft, Search } from "lucide-react";
import { TextToolBase } from "./TextToolBase";

export function TextCompare() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const compare = () => {
    if (text1 === text2) {
      setResult("The texts are completely identical.");
    } else {
      setResult("Differences found. (Diff highlighting coming soon, or use line-by-line compare). Length 1: " + text1.length + " | Length 2: " + text2.length);
    }
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
      {result && (
        <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center font-bold text-slate-800 dark:text-white">
          {result}
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
