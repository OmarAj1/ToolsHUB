import React, { useState, useRef, useCallback } from "react";
import { Copy, Download, Upload, Trash2, Check, FileText } from "lucide-react";

interface TextToolBaseProps {
  title: string;
  description: string;
  inputLabel?: string;
  outputLabel?: string;
  actionButtonText: string;
  onProcess: (input: string) => string | Promise<string>;
  allowBatch?: boolean; // If true, can process a list of files or something, but text tools usually operate on lines.
  extraControls?: React.ReactNode;
  exampleData?: string;
}

export function TextToolBase({
  title,
  description,
  inputLabel = "Input Text",
  outputLabel = "Result",
  actionButtonText,
  onProcess,
  extraControls,
  exampleData
}: TextToolBaseProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleProcess = async () => {
    setErrorMsg("");
    if (!input.trim()) {
      setErrorMsg("Please paste something first.");
      return;
    }
    
    setIsProcessing(true);
    
    // We use setTimeout to yield to the event loop so the browser doesn't freeze and React can render "Processing..."
    setTimeout(async () => {
      try {
        const res = await onProcess(input);
        setOutput(res);
      } catch (err) {
        console.error("Error processing text:", err);
        setErrorMsg("Failed to process text. The input might be too large or invalid.");
      } finally {
        setIsProcessing(false);
      }
    }, 10);
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
    setErrorMsg("");
  };

  const loadExample = () => {
    if (exampleData) {
      setInput(exampleData);
      setOutput("");
      setErrorMsg("");
    }
  };

  const readFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(`File exceeds 100MB limit. Found: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
      return;
    }
    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        // Prevent freezing by truncating very large sets for input box if needed
        // but for now, we'll try to load it entirely
        setInput(content);
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    readFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div 
        className="w-full bg-slate-900 bg-slate-800 border-2 border-dashed border-slate-700 border-slate-700 rounded-2xl p-6 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-slate-50 text-slate-50">{inputLabel}</label>
          <div className="flex gap-2">
            {exampleData && (
              <button 
                onClick={loadExample}
                className="px-3 py-1 bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-lg text-xs font-bold text-slate-50 text-slate-50 hover:bg-slate-900 hover:bg-slate-700 transition flex items-center gap-1"
              >
                <FileText className="w-3 h-3 text-purple-500" /> Try Example
              </button>
            )}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-lg text-xs font-bold text-slate-50 text-slate-50 hover:bg-slate-900 hover:bg-slate-700 transition flex items-center gap-1"
            >
              <Upload className="w-3 h-3 text-purple-500" /> Upload File
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
              className="px-3 py-1 bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-lg text-xs font-bold text-red-600 text-red-400 hover:bg-red-50 hover:bg-red-900/20 transition flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3 text-purple-500" /> Clear
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setErrorMsg(""); }}
          className="w-full h-48 p-4 bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-50 text-slate-50 transition-colors"
          placeholder="Type, paste, or drag & drop a text file here..."
        />
        
        {errorMsg && (
          <div className="mt-2 text-sm text-red-600 text-red-400 font-medium">
            {errorMsg}
          </div>
        )}

        <div className="mt-4 flex flex-col md:flex-row gap-4 items-center justify-center">
          {extraControls}
          <button 
            onClick={handleProcess}
            disabled={isProcessing}
            className={`px-6 py-3 bg-blue-500 text-white rounded-xl font-bold transition-colors shadow-sm ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600 shadow-blue-500/20'}`}
          >
            {isProcessing ? "Processing..." : actionButtonText}
          </button>
        </div>
      </div>
      
      {output && (
        <div className="w-full bg-slate-900 bg-slate-800 border border-slate-700 border-slate-700 rounded-2xl p-6 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-slate-50 text-slate-50">{outputLabel}</label>
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className={`px-3 py-1 bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 ${isCopied ? 'text-green-600 text-green-400 border-green-200 bg-green-50 bg-green-900/30' : 'text-slate-50 text-slate-50 hover:bg-slate-900 hover:bg-slate-700'}`}
              >
                {isCopied ? <><Check className="w-3 h-3 text-purple-500" /> Copied!</> : <><Copy className="w-3 h-3 text-purple-500" /> Copy</>}
              </button>
              <button 
                onClick={handleDownload}
                className="px-3 py-1 bg-slate-800 bg-slate-800 border border-slate-700 border-slate-700 rounded-lg text-xs font-bold text-slate-50 text-slate-50 hover:bg-slate-900 hover:bg-slate-700 transition flex items-center gap-1"
              >
                <Download className="w-3 h-3 text-purple-500" /> Download
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-48 p-4 bg-slate-800 bg-slate-900 border border-slate-700 border-slate-700 rounded-xl font-mono text-sm resize-y text-slate-50 text-slate-50 transition-colors"
          />
        </div>
      )}
    </div>
  );
}
