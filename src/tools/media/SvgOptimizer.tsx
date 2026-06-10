import React, { useState, useEffect } from 'react';
import { Copy, Check, Upload, RefreshCw } from 'lucide-react';

export function SvgOptimizer() {
  const [svgInput, setSvgInput] = useState('');
  const [svgOutput, setSvgOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Very basic cleanup (for complex SVGs, a library like SVGO is needed, but we build client-side regex for now)
  const optimizeSvg = (input: string) => {
    if (!input) {
      setSvgOutput('');
      return;
    }
    
    setIsProcessing(true);
    
    setTimeout(() => {
      let output = input;
      // Remove comments
      output = output.replace(/<!--[\s\S]*?-->/g, '');
      // Remove empty attributes roughly
      output = output.replace(/\s\w+="""/g, '');
      // Remove empty lines and extra spaces
      output = output.replace(/^\s*[\r\n]/gm, '');
      output = output.replace(/>\s+</g, '><');
      // Collapse multiple spaces
      output = output.replace(/\s{2,}/g, ' ');

      setSvgOutput(output);
      setIsProcessing(false);
    }, 100);
  };

  useEffect(() => {
    optimizeSvg(svgInput);
  }, [svgInput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(svgOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
         setSvgInput(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 text-slate-800 dark:text-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Input */}
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2">Original SVG</h3>
              <label className="cursor-pointer text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload File
                <input type="file" accept=".svg" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            <textarea
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              placeholder="Paste SVG code here..."
              className="flex-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 whitespace-pre"
            />
            {svgInput && <div className="mt-2 text-xs text-slate-500 font-bold text-right">{new Blob([svgInput]).size} bytes</div>}
         </div>

         {/* Output */}
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[600px] relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2">
                Optimized SVG 
                {isProcessing && <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />}
              </h3>
              <button 
                onClick={handleCopy}
                disabled={!svgOutput}
                className="text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} 
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              value={svgOutput}
              className="flex-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 font-mono text-xs resize-none focus:outline-none whitespace-pre-wrap word-break"
            />
            {svgOutput && (
              <div className="mt-2 flex justify-between items-center">
                <div className="text-xs font-bold text-green-600 dark:text-green-500">
                   Saved {Math.max(0, new Blob([svgInput]).size - new Blob([svgOutput]).size)} bytes
                </div>
                <div className="text-xs text-slate-500 font-bold">{new Blob([svgOutput]).size} bytes</div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
