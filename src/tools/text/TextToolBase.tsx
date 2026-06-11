import React, { useState, useRef, useCallback } from "react";
import { Copy, Download, Upload, Trash2, Check } from "lucide-react";

interface TextToolBaseProps {
  title: string;
  description: string;
  inputLabel?: string;
  outputLabel?: string;
  actionButtonText: string;
  onProcess: (input: string) => string;
  allowBatch?: boolean; // If true, can process a list of files or something, but text tools usually operate on lines.
  extraControls?: React.ReactNode;
}

export function TextToolBase({
  title,
  description,
  inputLabel = "Input Text",
  outputLabel = "Result",
  actionButtonText,
  onProcess,
  extraControls
}: TextToolBaseProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcess = () => {
    try {
      const res = onProcess(input);
      setOutput(res);
    } catch (err) {
      console.error("Error processing text");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "result.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setInput(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) setInput(content);
    };
    reader.readAsText(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div 
        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{inputLabel}</label>
          <div className="flex gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1"
            >
              <Upload className="w-3 h-3" /> Upload File
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".txt,.csv,.json,.md,.html" 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={clearAll}
              className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 transition-colors"
          placeholder="Type, paste, or drag & drop a text file here..."
        />
        
        <div className="mt-4 flex flex-col md:flex-row gap-4 items-center justify-center">
          {extraControls}
          <button 
            onClick={handleProcess}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20"
          >
            {actionButtonText}
          </button>
        </div>
      </div>
      
      {output && (
        <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{outputLabel}</label>
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className={`px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 ${isCopied ? 'text-green-600 dark:text-green-400 border-green-200 bg-green-50 dark:bg-green-900/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                {isCopied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
              <button 
                onClick={handleDownload}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Download
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-48 p-4 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm resize-y text-slate-800 dark:text-slate-200 transition-colors"
          />
        </div>
      )}
    </div>
  );
}
