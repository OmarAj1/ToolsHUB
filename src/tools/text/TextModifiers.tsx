import React from "react";
import { TextToolBase } from "./TextToolBase";

export function RemoveDuplicateLines() {
  const process = (input: string) => {
    const lines = input.split('\n');
    return Array.from(new Set(lines)).join('\n');
  };
  return <TextToolBase title="Remove Duplicate Lines" description="Remove all duplicate lines from your text." actionButtonText="Remove Duplicates" onProcess={process} />;
}

export function SortLines() {
  const process = (input: string) => {
    const lines = input.split('\n');
    return lines.sort((a, b) => a.localeCompare(b)).join('\n');
  };
  return <TextToolBase title="Sort Lines" description="Sort lines alphabetically A-Z." actionButtonText="Sort Lines" onProcess={process} />;
}

export function ReverseLines() {
  const process = (input: string) => {
    const lines = input.split('\n');
    return lines.reverse().join('\n');
  };
  return <TextToolBase title="Reverse Lines" description="Reverse the order of lines." actionButtonText="Reverse Lines" onProcess={process} />;
}

export function ConvertCase() {
  const process = (input: string) => {
    // We'll just do uppercase for this simple text tool base, but ideally a dropdown for Lower/Upper/Title.
    // To support a dropdown, I'd need extra UI in TextToolBase. I'll just make it Uppercase by default or build a custom tool.
    return input.toUpperCase();
  };
  return <TextToolBase title="Convert Case to Uppercase" description="Convert text to uppercase." actionButtonText="Convert to Uppercase" onProcess={process} />;
}

export function CaseConverter() {
    // Custom tool requiring a select for mode
    const [input, setInput] = React.useState("");
    const [output, setOutput] = React.useState("");
    const [mode, setMode] = React.useState("upper");
    const [isCopied, setIsCopied] = React.useState(false);
  
    const handleProcess = () => {
      let res = input;
      if (mode === "upper") res = input.toUpperCase();
      if (mode === "lower") res = input.toLowerCase();
      if (mode === "title") {
          res = input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
      }
      if (mode === "sentence") {
          res = input.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
      }
      setOutput(res);
    };
  
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 transition-colors mb-4"
          />
          <div className="flex items-center gap-4">
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  <option value="upper">UPPERCASE</option>
                  <option value="lower">lowercase</option>
                  <option value="title">Title Case</option>
                  <option value="sentence">Sentence case.</option>
              </select>
            <button 
              onClick={handleProcess}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Convert Case
            </button>
          </div>
        </div>
        {output && (
          <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Result</label>
              <button 
                  onClick={() => { navigator.clipboard.writeText(output); setIsCopied(true); setTimeout(()=>setIsCopied(false), 2000); }}
                  className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
                >
                  {isCopied ? "Copied!" : "Copy"}
                </button>
            </div>
            <textarea readOnly value={output} className="w-full h-48 p-4 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm resize-y text-slate-800 dark:text-slate-200" />
          </div>
        )}
      </div>
    );
}

export function ExtractEmails() {
  const process = (input: string) => {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = input.match(regex) || [];
    return Array.from(new Set(matches)).join('\n');
  };
  return <TextToolBase title="Extract Emails" description="Extract all email addresses from text." actionButtonText="Extract Emails" onProcess={process} />;
}

export function ExtractUrls() {
  const process = (input: string) => {
    const regex = /(https?:\/\/[^\s]+)/g;
    const matches = input.match(regex) || [];
    return Array.from(new Set(matches)).join('\n');
  };
  return <TextToolBase title="Extract URLs" description="Extract all website links from text." actionButtonText="Extract URLs" onProcess={process} />;
}

export function RemoveEmptyLines() {
  const process = (input: string) => {
    return input.split('\n').filter(line => line.trim().length > 0).join('\n');
  };
  return <TextToolBase title="Remove Empty Lines" description="Remove all empty or whitespace-only lines." actionButtonText="Remove Empty Lines" onProcess={process} />;
}

export function WhitespaceRemover() {
    const process = (input: string) => {
      // Remove leading/trailing, reduce multiple spaces to single
      return input.split('\n').map(l => l.trim().replace(/\s+/g, ' ')).join('\n');
    };
    return <TextToolBase title="Whitespace Remover" description="Clean up extra spaces." actionButtonText="Remove Extra Spaces" onProcess={process} />;
}
